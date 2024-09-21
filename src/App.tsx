import { useEffect, useState } from "react";
import { Card, CardFooter, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Trash2, UserRoundPen , Plus} from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { notifyAdd, notifyDelete, notifyUpdate } from "./components/toasts/toasts";
import { SkeletonCard } from "./components/Skeleton/Skeleton";


interface Note {
  _id: string;
  FullName: string;
  Email: string;
  PhoneNumber: string;
}

export default function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Add Modal State
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [formData, setFormData] = useState({
    FullName: '',
    Email: '',
    PhoneNumber: ''
  });
  const [formErrors, setFormErrors] = useState({
    FullName: '',
    Email: '',
    PhoneNumber: ''
  });

  useEffect(() => {
    const GetNotes = async () => {

      await new Promise((res) => setTimeout(res,6000))
      try {
        const res = await fetch('https://noteaddresssapp.onrender.com/api/v1/notes/');
        if (!res.ok) throw new Error("Failed to fetch notes");

        const jsonData = await res.json();
        const data = jsonData?.data;
        setNotes(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    GetNotes();
  }, []);

  

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`https://noteaddresssapp.onrender.com/api/v1/notes/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error("Failed to delete the note");

      setNotes((prevNotes) => prevNotes.filter(note => note._id !== id));
      notifyDelete();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const openEditModal = (note: Note) => {
    setSelectedNote(note);
    setFormData({
      FullName: note.FullName,
      Email: note.Email,
      PhoneNumber: note.PhoneNumber
    });
    setFormErrors({ FullName: '', Email: '', PhoneNumber: '' });
    setIsEditModalOpen(true);
  };

  const openAddModal = () => {
    setFormData({
      FullName: '',
      Email: '',
      PhoneNumber: ''
    });
    setFormErrors({ FullName: '', Email: '', PhoneNumber: '' });
    setIsAddModalOpen(true);
  };

  const closeModal = () => {
    setIsEditModalOpen(false);
    setIsAddModalOpen(false);
    setSelectedNote(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: ''
    }));
  };

  const validateForm = () => {
    let isValid = true;
    let errors = {
      FullName: '',
      Email: '',
      PhoneNumber: ''
    };

    if (!formData.FullName.trim()) {
      errors.FullName = 'Full Name is required';
      isValid = false;
    }

    if (!formData.Email.trim()) {
      errors.Email = 'Email is required';
      isValid = false;
    }

    if (!formData.PhoneNumber.trim()) {
      errors.PhoneNumber = 'Phone Number is required';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleEdit = async () => {
    if (!selectedNote) return;

    if (!validateForm()) return;

    try {
      const res = await fetch(`https://noteaddresssapp.onrender.com/api/v1/notes/${selectedNote._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to update the note");

      const updatedNote = await res.json();

      setNotes((prevNotes) =>
        prevNotes.map((note) => (note._id === updatedNote.data._id ? updatedNote.data : note))
      );

      notifyUpdate();
      closeModal();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleAdd = async () => {
    if (!validateForm()) return;

    try {
      const res = await fetch('https://noteaddresssapp.onrender.com/api/v1/notes/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to add the note");

      const newNote = await res.json();

      setNotes((prevNotes) => [...prevNotes, newNote.data]);

      notifyAdd();
      closeModal();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="bg-muted min-h-screen">
      <Toaster /> 
      <div className="container w-full">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold p-6">Address Notes List</h1>
          <Button className="bg-green-500 px-2" onClick={openAddModal}>
            <Plus /> 
          </Button>
        </div>
        <p className="px-6 max-w-[650px] text-gray-500">Easily create, update, and delete contact notes with our intuitive interface. also for data management and real-time notifications to stay organized and connected!</p>
        <div className="p-6 flex gap-6 flex-wrap">
          {notes.length > 0 ? (
            notes.map((note: Note) => (
              <Card key={note._id} className="min-w-[350px] shadow-lg mb-8">
                <CardHeader>
                  <CardTitle className="text-blue-500 mb-1">{note.FullName}</CardTitle>
                  <p className="flex gap-2 text-sm">
                    <span className="font-bold text-slate-700">Email:</span>{note.Email}
                  </p>
                  <p className="flex gap-2 text-sm">
                    <span className="font-bold text-slate-700">Phone Number:</span>{note.PhoneNumber}
                  </p>
                </CardHeader>
                <CardFooter className="flex gap-2 justify-end">
                  <Button className="bg-red-600 text-white h-fit p-2" onClick={() => handleDelete(note._id)}>
                    <Trash2 size={18} />
                  </Button>
                  <Button className="bg-yellow-500 text-white h-fit p-2" onClick={() => openEditModal(note)}>
                    <UserRoundPen size={18} />
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="flex gap-12 flex-wrap  ">
              {Array(7).fill(0).map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          )}
        </div>

        {isEditModalOpen && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-96">
              <h2 className="text-xl font-semibold mb-4">Edit Note</h2>
              <div className="space-y-4">
                <div>
                  <label className="block font-semibold">Full Name</label>
                  <input
                    type="text"
                    name="FullName"
                    value={formData.FullName}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                  {formErrors.FullName && <p className="text-red-500 text-sm">{formErrors.FullName}</p>}
                </div>
                <div>
                  <label className="block font-semibold">Email</label>
                  <input
                    type="text"
                    name="Email"
                    value={formData.Email}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                  {formErrors.Email && <p className="text-red-500 text-sm">{formErrors.Email}</p>}
                </div>
                <div>
                  <label className="block font-semibold">Phone Number</label>
                  <input
                    type="text"
                    name="PhoneNumber"
                    value={formData.PhoneNumber}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                  {formErrors.PhoneNumber && <p className="text-red-500 text-sm">{formErrors.PhoneNumber}</p>}
                </div>
                <div className="flex justify-end gap-4">
                  <Button onClick={closeModal} className="bg-gray-500 text-white">Cancel</Button>
                  <Button onClick={handleEdit} className="bg-blue-500 text-white">Save Changes</Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {isAddModalOpen && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-96">
              <h2 className="text-xl font-semibold mb-4">Add New Note</h2>
              <div className="space-y-4">
                <div>
                  <label className="block font-semibold">Full Name</label>
                  <input
                    type="text"
                    name="FullName"
                    value={formData.FullName}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                  {formErrors.FullName && <p className="text-red-500 text-sm">{formErrors.FullName}</p>}
                </div>
                <div>
                  <label className="block font-semibold">Email</label>
                  <input
                    type="text"
                    name="Email"
                    value={formData.Email}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                  {formErrors.Email && <p className="text-red-500 text-sm">{formErrors.Email}</p>}
                </div>
                <div>
                  <label className="block font-semibold">Phone Number</label>
                  <input
                    type="text"
                    name="PhoneNumber"
                    value={formData.PhoneNumber}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                  {formErrors.PhoneNumber && <p className="text-red-500 text-sm">{formErrors.PhoneNumber}</p>}
                </div>
                <div className="flex justify-end gap-4">
                  <Button onClick={closeModal} className="bg-gray-500 text-white">Cancel</Button>
                  <Button onClick={handleAdd} className="bg-green-500 text-white">Add Note</Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
