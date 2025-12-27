import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';

interface QuestionData {
  questionText: string;
  options: { text: string; isCorrect: boolean }[];
}

interface LiveTestFormData {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  duration: number;
  questions: QuestionData[];
}

const AdminLiveTestEditPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // For editing existing live test

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [duration, setDuration] = useState(0);
  const [questions, setQuestions] = useState<QuestionData[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/');
      return;
    }

    if (id) {
      const fetchLiveTest = async () => {
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          // TODO: Implement backend route for admin to get single live test
          const { data } = await axios.get<LiveTestFormData>(`http://localhost:5000/api/livetests/admin/${id}`, config);
          setTitle(data.title);
          setDescription(data.description);
          setStartTime(data.startTime.substring(0, 16)); // Format for datetime-local input
          setEndTime(data.endTime.substring(0, 16)); // Format for datetime-local input
          setDuration(data.duration);
          setQuestions(data.questions);
          setLoading(false);
        } catch (err) {
          console.error(err);
          setError('Failed to fetch live test details');
          setLoading(false);
        }
      };
      fetchLiveTest();
    } else {
      setLoading(false);
    }
  }, [id, user, navigate]);

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
    };

    try {
      const liveTestPayload: LiveTestFormData = { title, description, startTime, endTime, duration, questions };
      let response;

      if (id) {
        // Update live test
        // TODO: Implement backend route for admin to update live test
        response = await axios.put(`http://localhost:5000/api/livetests/admin/${id}`, liveTestPayload, config);
        alert('Live Test updated successfully');
      } else {
        // Create new live test
        // TODO: Implement backend route for admin to create live test
        response = await axios.post('http://localhost:5000/api/livetests/admin', liveTestPayload, config);
        alert('Live Test created successfully');
      }
      navigate('/admin/livetests');
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to save live test');
    }
  };

  const handleAddQuestionField = () => {
    setQuestions([...questions, { questionText: '', options: [{ text: '', isCorrect: false }] }]);
  };

  const handleQuestionChange = (index: number, field: keyof QuestionData, value: string) => {
    const newQuestions = [...questions];
    // @ts-ignore
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (questionIndex: number, optionIndex: number, field: 'text' | 'isCorrect', value: string | boolean) => {
    const newQuestions = [...questions];
    // @ts-ignore
    newQuestions[questionIndex].options[optionIndex][field] = value;
    setQuestions(newQuestions);
  };

  const handleAddOptionField = (questionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.push({ text: '', isCorrect: false });
    setQuestions(newQuestions);
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center my-8">{id ? 'Edit Live Test' : 'Create New Live Test'}</h1>
      <form onSubmit={submitHandler} className="bg-white shadow-lg rounded-lg p-8 mb-8">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">Title</label>
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">Description</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" rows={5} required></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="startTime">Start Time</label>
          <input type="datetime-local" id="startTime" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="endTime">End Time</label>
          <input type="datetime-local" id="endTime" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="duration">Duration (minutes)</label>
          <input type="number" id="duration" value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
        </div>

        <h2 className="text-3xl font-bold mb-4 mt-8">Manage Questions</h2>
        {questions.map((question, questionIndex) => (
          <div key={questionIndex} className="border p-4 rounded-md mb-4 bg-gray-50">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Question Text</label>
              <textarea value={question.questionText} onChange={(e) => handleQuestionChange(questionIndex, 'questionText', e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" rows={3}></textarea>
            </div>
            <h4 className="text-xl font-bold mb-2 mt-4">Options</h4>
            {question.options.map((option, optionIndex) => (
              <div key={optionIndex} className="flex items-center mb-2">
                <input type="text" value={option.text} onChange={(e) => handleOptionChange(questionIndex, optionIndex, 'text', e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2" />
                <label className="inline-flex items-center">
                  <input type="checkbox" checked={option.isCorrect} onChange={(e) => handleOptionChange(questionIndex, optionIndex, 'isCorrect', e.target.checked)} className="form-checkbox" />
                  <span className="ml-2 text-gray-700">Correct</span>
                </label>
              </div>
            ))}
            <button type="button" onClick={() => handleAddOptionField(questionIndex)} className="bg-blue-400 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline mt-2">
              Add Option
            </button>
          </div>
        ))}
        <button type="button" onClick={handleAddQuestionField} className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4">
          Add New Question
        </button>

        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2 mt-8">
          {id ? 'Update Live Test' : 'Create Live Test'}
        </button>
        <button type="button" onClick={() => navigate('/admin/livetests')} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-8">
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AdminLiveTestEditPage;

