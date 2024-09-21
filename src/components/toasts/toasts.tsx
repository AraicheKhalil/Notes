import toast from "react-hot-toast";


export const notifyDelete = () => {
    toast('The Note Has Been Deleted Successfully', {
      duration: 5000,
      position: 'top-center',
      style: {
        background: '#ef4444',
        color: '#fff',
      }
    });
  };

  export const notifyUpdate = () => {
    toast('The Note Has Been Updated Successfully', {
      duration: 5000,
      position: 'top-center',
      style: {
        background: '#f59e0b',
        color: '#fff',
      }
    });
  };

  export const notifyAdd = () => {
    toast('New Note Added Successfully', {
      duration: 5000,
      position: 'top-center',
      style: {
        background: '#22c55e',
        color: '#fff',
      }
    });
  };