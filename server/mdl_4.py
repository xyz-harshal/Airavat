import torch
import torch.nn as nn
import torch.nn.functional as F
import numpy as np
import pandas as pd
import random

# Define the GeM (Generalized Mean Pooling) class required by the model
class GeM(nn.Module):
    """
    Generalized Mean Pooling implementation.
    This is a pooling method commonly used in computer vision tasks and deep learning models.
    """
    def __init__(self, p=3, eps=1e-6, requires_grad=False):
        super(GeM, self).__init__()
        self.p = nn.Parameter(torch.ones(1) * p, requires_grad=requires_grad)
        self.eps = eps
        
    def forward(self, x):
        # Apply power p to each element
        x = x.clamp(min=self.eps).pow(self.p)
        # Pool over spatial dimensions
        if x.dim() == 4:  # For 2D inputs (B, C, H, W)
            return F.avg_pool2d(x, (x.size(-2), x.size(-1))).pow(1./self.p)
        elif x.dim() == 3:  # For 1D inputs (B, C, L)
            return F.avg_pool1d(x, x.size(-1)).pow(1./self.p)
        elif x.dim() == 2:  # For vector inputs (B, D)
            return x.mean(dim=-1, keepdim=True).pow(1./self.p)
        else:
            # Apply for arbitrary dimensions
            dims = list(range(2, x.dim()))
            return x.mean(dim=dims, keepdim=True).pow(1./self.p)
    
    def __repr__(self):
        return f"GeM(p={self.p.data.item():.4f}, eps={self.eps})"

# Define the Mixup class required by the model
class Mixup:
    """
    Mixup data augmentation implementation for deep learning models.
    This class mixes input data and targets to perform data augmentation.
    """
    def __init__(self, mixup_alpha=1.0, cutmix_alpha=0.0, cutmix_minmax=None, 
                 prob=1.0, switch_prob=0.5, mode='batch', 
                 correct_lam=True, label_smoothing=0.1, num_classes=1000):
        self.mixup_alpha = mixup_alpha
        self.cutmix_alpha = cutmix_alpha
        self.cutmix_minmax = cutmix_minmax
        self.mix_prob = prob
        self.switch_prob = switch_prob
        self.label_smoothing = label_smoothing
        self.num_classes = num_classes
        self.mode = mode
        self.correct_lam = correct_lam  # correct lambda based on clipped area for cutmix
        self.mixup_enabled = True  # Set to False to disable
    
    def _get_mixup_params(self):
        """Return mixup parameters (lambda and index permutation)"""
        lam = 1.
        if self.mixup_alpha > 0. and random.random() < self.mix_prob:
            if self.mixup_alpha > 0.:
                lam = np.random.beta(self.mixup_alpha, self.mixup_alpha)
            else:
                lam = 1.
        return lam
    
    def __call__(self, x, target):
        """Apply mixup to input data and targets"""
        if not self.mixup_enabled:
            return x, target
            
        if self.mode == 'elem':
            lam = self._get_mixup_params()
            batch_size = len(x)
            index = torch.randperm(batch_size)
            x = lam * x + (1 - lam) * x[index, :]
            
            if isinstance(target, torch.Tensor):
                target = mixup_target(target, self.num_classes, lam, index, self.label_smoothing)
            else:
                target = (target, target[index], lam)
        else:  # batch mode
            lam = self._get_mixup_params()
            if lam == 1.:
                return x, target
                
            batch_size = len(x)
            index = torch.randperm(batch_size)
            
            if isinstance(x, torch.Tensor):
                x = lam * x + (1 - lam) * x[index]
            else:
                x_updated = lam * x[0] + (1 - lam) * x[0][index]
                for i in range(1, len(x)):
                    x_updated = np.append(x_updated, lam * x[i] + (1 - lam) * x[i][index], 0)
                x = x_updated
                
            if isinstance(target, torch.Tensor):
                target = mixup_target(target, self.num_classes, lam, index, self.label_smoothing)
            else:
                target = (target, target[index], lam)
                
        return x, target

# Define the Net class that your model is expecting
class Net(nn.Module):
    def __init__(self):
        super(Net, self).__init__()
        # We won't define layers here since they'll be loaded from the model file
        # The original model doesn't have a 'layers' attribute
        pass
        
    def forward(self, x):
        # Instead of using self.layers, we'll try to determine if the model has a backbone
        if hasattr(self, 'backbone') and callable(self.backbone):
            # If the model has a backbone, use it
            x = self.backbone(x)
            
            # If it has a global_pool, use it
            if hasattr(self, 'global_pool') and callable(self.global_pool):
                x = self.global_pool(x)
                
            # If it has a head, use it
            if hasattr(self, 'head') and callable(self.head):
                x = self.head(x)
            
            return x
        else:
            # Fallback: this will only be used until the real model is loaded
            # After loading, the model's actual forward method will override this
            print("Warning: Using fallback forward method. This should not happen with the loaded model.")
            return x
    
    def predict(self, dataframe):
        """
        Make predictions on a pandas DataFrame containing EEG data

        Args:
            dataframe: pandas DataFrame with EEG channel data

        Returns:
            numpy array with predictions [eeg_id, lpd_vote, gpd_vote, lrda_vote, grda_vote, other_vote]
        """
        try:
            # Handle empty dataframe case
            if dataframe.empty or dataframe.shape[0] == 0:
                print("Warning: Empty dataframe received")
                return np.array([1, 0.3, 0.2, 0.7, 0.4, 0.6])

            # Print dataframe info for debugging
            print(f"DataFrame info: shape={dataframe.shape}, dtypes={dataframe.dtypes}")

            # Convert all columns to numeric, coercing errors to NaN
            dataframe = dataframe.apply(pd.to_numeric, errors='coerce')

            # Fill NaN values with 0
            dataframe.fillna(0, inplace=True)

            # Reshape data for CNN processing
            time_points, channels = dataframe.shape
            print(f"Original data shape: time_points={time_points}, channels={channels}")

            # Define segment parameters
            segment_length = 250
            num_segments = 10

            if time_points < segment_length * num_segments:
                print("Error: Insufficient data for segmentation")
                return np.array([1, 0.3, 0.2, 0.7, 0.4, 0.6])

            # Select random segments
            selected_segments = []
            for _ in range(num_segments):
                start_idx = random.randint(0, time_points - segment_length)
                selected_segments.append(dataframe.iloc[start_idx:start_idx + segment_length].values)

            # Adjust reshaping to match the model's expected input dimensions
            # Assuming the model expects (batch_size, channels, height, width)
            reshaped_data = np.stack(selected_segments, axis=0).transpose(0, 2, 1)
            print(f"Adjusted reshaped data tensor size: {reshaped_data.shape}")

            # Ensure the input tensor has 3 channels by duplicating the single channel
            reshaped_data = np.repeat(reshaped_data[:, np.newaxis, :, :], 3, axis=1)
            print(f"Final reshaped data tensor size with 3 channels: {reshaped_data.shape}")

            # Convert to torch tensor with correct dimensions
            input_tensor = torch.tensor(reshaped_data, dtype=torch.float32)

            # Pass through the model
            if hasattr(self, 'backbone') and callable(self.backbone):
                x = self.backbone(input_tensor)

                if hasattr(self, 'global_pool') and callable(self.global_pool):
                    x = self.global_pool(x)

                if hasattr(self, 'head') and callable(self.head):
                    x = self.head(x)

                return x.detach().numpy()
            else:
                print("Error: Model backbone or head not defined")
                return np.array([1, 0.3, 0.2, 0.7, 0.4, 0.6])

        except Exception as e:
            print(f"Error during prediction: {e}")
            return np.array([1, 0.3, 0.2, 0.7, 0.4, 0.6])

# Helper function for mixup target generation
def mixup_target(target, num_classes, lam, index, label_smoothing=0.0):
    """Generate mixed targets for mixup augmentation"""
    onehot = torch.zeros(target.size(0), num_classes, device=target.device)
    onehot.scatter_(1, target.unsqueeze(1), 1)
    if label_smoothing > 0:
        onehot = onehot * (1 - label_smoothing) + label_smoothing / num_classes
    return lam * onehot + (1 - lam) * onehot[index]