import mne
from mne.datasets import fetch_fsaverage, sample
from mne.minimum_norm import make_inverse_operator, apply_inverse
import os.path as op

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

# Visualize the source estimates
brain = stc.plot(
    subjects_dir=subjects_dir,
    surface='white',
    hemi='split',
    views=['lat', 'med'],
    initial_time=0.1,
    title='EEG Source Estimates (dSPM)'
)

# Save a snapshot of the visualization
brain.save_image('eeg_3d_visualization.png')

# Close the visualization window
brain.close()