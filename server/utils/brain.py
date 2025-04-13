import mne
from mne.datasets import fetch_fsaverage, sample
from mne.minimum_norm import make_inverse_operator, apply_inverse
import os.path as op
import os
import pyvistaqt
import numpy as np
import json

def prepare_source_data():
    """Prepare the source data for brain visualization."""
    
    # Load the sample dataset
    data_path = sample.data_path()
    raw_file = data_path / 'MEG' / 'sample' / 'sample_audvis_filt-0-40_raw.fif'
    raw = mne.io.read_raw_fif(raw_file, preload=True)

    # Find events (using a trigger channel) before selecting EEG channels
    events = mne.find_events(raw, stim_channel='STI 014')

    # Select only EEG channels
    raw = raw.pick_types(meg=False, eeg=True)

    # Check EEG channel locations
    if not all(ch['loc'][:3].any() for ch in raw.info['chs'] if ch['kind'] == mne.io.constants.FIFF.FIFFV_EEG_CH):
        raise RuntimeError("Some EEG channels are missing location data")

    # Filter the data (1-40 Hz)
    raw.filter(1, 40)

    # Fetch fsaverage data
    fs_dir = fetch_fsaverage(verbose=True)
    subjects_dir = op.dirname(fs_dir)

    # Set up source space
    src = mne.setup_source_space('fsaverage', spacing='ico4', subjects_dir=subjects_dir)

    # Load BEM solution
    bem = mne.read_bem_solution(op.join(fs_dir, 'bem', 'fsaverage-5120-5120-5120-bem-sol.fif'))

    # Create forward solution
    fwd = mne.make_forward_solution(raw.info, trans=None, src=src, bem=bem, eeg=True, meg=False)

    # Create epochs
    epochs = mne.Epochs(raw, events, tmin=-0.2, tmax=0.5, baseline=(None, 0), preload=True)

    # Compute evoked response
    evoked = epochs.average()

    # Compute noise covariance
    noise_cov = mne.compute_covariance(epochs, tmin=None, tmax=0)

    # Create inverse operator
    inverse_operator = make_inverse_operator(evoked.info, fwd, noise_cov)

    # Apply inverse method
    stc = apply_inverse(evoked, inverse_operator, lambda2=1.0/9.0, method='dSPM')
    
    return stc, src

# Export brain data for web rendering
def export_brain_data_for_web(stc, src, output_path='brain_data.json', web_output_dir='brain_web_export'):
    """Export brain data for web rendering using PyVista's VTK format and JSON."""
    import pyvista as pv
    import os
    
    # Create output directory if it doesn't exist
    os.makedirs(web_output_dir, exist_ok=True)
    
    # Extract left and right hemisphere data
    lh_vertices = src[0]['rr']
    lh_faces = src[0]['tris']
    rh_vertices = src[1]['rr']
    rh_faces = src[1]['tris']

    # Combine into a single mesh
    vertices = np.concatenate([lh_vertices, rh_vertices])
    faces = np.concatenate([lh_faces, rh_faces + len(lh_vertices)])
    
    # Get activation data for each time point
    activation_data = stc.data
    
    # Get time points
    times = stc.times
    
    # Create a time-info dictionary for the UI
    time_info = {
        'times': times.tolist(),
        'min_time': float(times.min()),
        'max_time': float(times.max()),
        'time_step': float(times[1] - times[0]) if len(times) > 1 else 0.01
    }
    
    # Create PyVista mesh for each time point (or just for the initial time)
    mesh = pv.PolyData(vertices, np.hstack([np.full((faces.shape[0], 1), 3), faces]))
    mesh.point_data["activation"] = activation_data[0]  # Initial timepoint activation
    
    # Export mesh as VTK for web viewing
    vtk_path = os.path.join(web_output_dir, 'brain_model.vtk')
    mesh.save(vtk_path)
    
    # Also export as vtkjs as an alternative format
    vtkjs_path = os.path.join(web_output_dir, 'brain_model.vtkjs')
    mesh.save(vtkjs_path)
    
    # Also save the JSON data for time series control
    data_dict = {
        'time_info': time_info,
        'activation_data': activation_data.tolist(),
        'vertices': vertices.tolist(),
        'faces': faces.tolist()
    }
    
    # Save to JSON
    with open(output_path, 'w') as f:
        json.dump(data_dict, f)
    
    print(f"Brain visualization exported to VTK: {vtk_path}")
    print(f"Brain visualization exported to vtkjs: {vtkjs_path}")
    print(f"Time info and activation data exported to: {output_path}")
    
    return output_path, vtk_path

# Export the brain data for web rendering
# Use absolute path to ensure file is created in the correct location
current_dir = op.dirname(op.abspath(__file__))
output_path = op.join(current_dir, 'brain_data.json')
web_data_path = export_brain_data_for_web(stc, src, output_path)

# Visualize with PyVistaQt backend
brain = stc.plot(
    subjects_dir=subjects_dir,
    surface='white',
    hemi='split',
    views=['lat', 'med'],
    initial_time=0.1,
    title='EEG Source Estimates (dSPM)'
)

# Save snapshot
brain.save_image('eeg_3d_visualization.png')

# Get the plotter instance and start Qt event loop
print("Close the visualization window to exit the program")
plotter = brain._renderer.plotter
plotter.show()  # Remove the interactive=True parameter
plotter.app.exec_()  # Start Qt event loop
