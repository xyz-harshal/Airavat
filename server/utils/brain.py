import mne
from mne.datasets import fetch_fsaverage, sample
from mne.minimum_norm import make_inverse_operator, apply_inverse
import os.path as op
import numpy as np
import trimesh
from matplotlib.cm import get_cmap
from matplotlib.colors import Normalize

# Install Qt bindings if not present (run this command first in your terminal)
# pip install PyQt5  # or pip install PyQt6

# Attempt to set pyvistaqt backend, fall back to pyvista if Qt bindings are missing
try:
    mne.viz.set_3d_backend("pyvistaqt")
except Exception as e:
    print(f"Failed to set pyvistaqt backend: {e}. Falling back to pyvista with off_screen mode.")
    mne.viz.set_3d_backend("pyvista")

# Load the sample dataset
data_path = sample.data_path()
raw_file = data_path / 'MEG' / 'sample' / 'sample_audvis_filt-0-40_raw.fif'
raw = mne.io.read_raw_fif(raw_file, preload=True)

# Find events (using a trigger channel) before selecting EEG channels
events = mne.find_events(raw, stim_channel='STI 014')

# Select only EEG channels
raw = raw.pick_types(meg=False, eeg=True)

# Check that EEG channels have location data
if not all(ch['loc'][:3].any() for ch in raw.info['chs'] if ch['kind'] == mne.io.constants.FIFF.FIFFV_EEG_CH):
    raise RuntimeError("Some EEG channels are missing location data")

# Filter the data (1-40 Hz)
raw.filter(1, 40)

# Fetch fsaverage data
fs_dir = fetch_fsaverage(verbose=True)
subjects_dir = op.dirname(fs_dir)

# Set up the source space for fsaverage
src = mne.setup_source_space('fsaverage', spacing='ico4', subjects_dir=subjects_dir)

# Load the BEM solution for fsaverage
bem = mne.read_bem_solution(op.join(fs_dir, 'bem', 'fsaverage-5120-5120-5120-bem-sol.fif'))

# Create the forward solution
fwd = mne.make_forward_solution(raw.info, trans=None, src=src, bem=bem, eeg=True, meg=False)

# Create epochs (-0.2 to 0.5 seconds around each event)
epochs = mne.Epochs(raw, events, tmin=-0.2, tmax=0.5, baseline=(None, 0), preload=True)

# Compute the evoked response
evoked = epochs.average()

# Compute noise covariance from baseline
noise_cov = mne.compute_covariance(epochs, tmin=None, tmax=0)

# Create the inverse operator
inverse_operator = make_inverse_operator(evoked.info, fwd, noise_cov)

# Apply the inverse method (dSPM)
stc = apply_inverse(evoked, inverse_operator, lambda2=1.0 / 9.0, method='dSPM')

# Attempt to visualize the source estimates
try:
    brain = stc.plot(
        subjects_dir=subjects_dir,
        surface='white',
        hemi='split',
        views=['lat', 'med'],
        initial_time=0.1,
        title='EEG Source Estimates (dSPM)',
        off_screen=True  # Force off-screen rendering for non-interactive environments
    )
    brain.save_image('eeg_3d_visualization.png')
    brain.close()
except Exception as e:
    print(f"Visualization failed with error: {e}. Proceeding to .ply export.")

# Export to .ply format with vertex colors
# Find the time index closest to 0.1 seconds
time_idx = np.argmin(np.abs(stc.times - 0.1))
data_at_t = stc.data[:, time_idx]  # Shape: (5124,) for source space vertices

# Map data to colors using the 'hot' colormap
fmin = np.min(data_at_t)
fmax = np.max(data_at_t)
cmap = get_cmap('hot')
norm = Normalize(vmin=fmin, vmax=fmax)
colors = cmap(norm(data_at_t))  # Shape: (5124, 4) with RGBA values in [0,1]

# Split colors into left and right hemispheres
n_lh = len(stc.lh_vertno)
colors_lh = colors[:n_lh]  # Colors for left hemisphere source vertices
colors_rh = colors[n_lh:]  # Colors for right hemisphere source vertices

# Read full surface files for fsaverage
lh_verts, lh_faces = mne.read_surface(op.join(subjects_dir, 'fsaverage', 'surf', 'lh.white'))
rh_verts, rh_faces = mne.read_surface(op.join(subjects_dir, 'fsaverage', 'surf', 'rh.white'))

# Create full color arrays, default to white for non-source vertices
full_lh_colors = np.ones((len(lh_verts), 4)) * [1.0, 1.0, 1.0, 1.0]  # White background
full_lh_colors[stc.lh_vertno] = colors_lh  # Assign colors to source vertices
full_rh_colors = np.ones((len(rh_verts), 4)) * [1.0, 1.0, 1.0, 1.0]  # White background
full_rh_colors[stc.rh_vertno] = colors_rh  # Assign colors to source vertices

# Create 3D meshes for each hemisphere
lh_mesh = trimesh.Trimesh(vertices=lh_verts, faces=lh_faces, vertex_colors=full_lh_colors)
rh_mesh = trimesh.Trimesh(vertices=rh_verts, faces=rh_faces, vertex_colors=full_rh_colors)

# Combine both hemispheres into a single mesh
combined_mesh = trimesh.util.concatenate([lh_mesh, rh_mesh])

# Export the combined mesh to .ply format
combined_mesh.export('brain.ply')

print("3D brain model saved as 'brain.ply'")