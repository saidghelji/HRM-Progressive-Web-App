import React, { useState } from 'react';
import { Candidate } from '../../types';
import { X } from 'lucide-react';

interface CandidateFormProps {
  onClose: () => void;
  onSave: (candidateData: Omit<Candidate, 'id' | 'status'>) => void;
  candidate?: Candidate;
}

const CandidateForm: React.FC<CandidateFormProps> = ({ onClose, onSave, candidate }) => {
  const [name, setName] = useState(candidate?.name || '');
  const [email, setEmail] = useState(candidate?.email || '');
  const [phone, setPhone] = useState(candidate?.phone || '');
  const [position, setPosition] = useState(candidate?.position || '');
  const [experience, setExperience] = useState(candidate?.experience?.toString() || '');
  const [source, setSource] = useState(candidate?.source || '');
  const [skills, setSkills] = useState<string[]>(candidate?.skills || []);
  const [skillInput, setSkillInput] = useState('');

  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills(prev => [...prev, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(prev => prev.filter(skill => skill !== skillToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !position || !experience || !source) {
      alert('Please fill in all fields.');
      return;
    }

    if (candidate) {
      // Editing existing candidate
      onSave({
        id: candidate.id,
        status: candidate.status,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        position: position.trim(),
        experience: Number(experience),
        source: source.trim(),
        skills: skills.map(s => s.trim()),
        applicationDate: candidate.applicationDate,
        interviews: candidate.interviews,
      } as Candidate);
    } else {
      // Adding new candidate
      onSave({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        position: position.trim(),
        experience: Number(experience),
        source: source.trim(),
        skills: skills.map(skill => skill.trim()),
        applicationDate: new Date().toISOString(),
        interviews: [],
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
        <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
          <h2 className="text-xl font-semibold">{candidate ? 'Edit Candidate' : 'Add New Candidate'}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-white hover:text-blue-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name*</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email*</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone*</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="position" className="block text-sm font-medium text-gray-700">Position*</label>
            <input
              type="text"
              id="position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="experience" className="block text-sm font-medium text-gray-700">Experience (Years)*</label>
            <input
              type="number"
              id="experience"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="source" className="block text-sm font-medium text-gray-700">Source*</label>
            <input
              type="text"
              id="source"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

        <div className="space-y-2">
            <label htmlFor="skills" className="block text-sm font-medium text-gray-700">Skills</label>
            <div className="flex space-x-2">
              <input
                type="text"
                id="skills"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add a skill (e.g., React, Node.js)"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Add
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span key={index} className="flex items-center bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm">
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="ml-2 text-gray-600 hover:text-gray-900"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {candidate ? 'Save Changes' : 'Add Candidate'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CandidateForm;