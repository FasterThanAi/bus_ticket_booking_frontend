import React, { useState } from 'react';

function AddForm({ title, formFields, onSubmit }) {
  const [formData, setFormData] = useState(
    formFields.reduce((acc, field) => {
      acc[field.name] = '';
      return acc;
    }, {})
  );
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const result = await onSubmit(formData);
      setSuccess(result.message || 'Added successfully!');
      // Clear the form
      setFormData(
        formFields.reduce((acc, field) => {
          acc[field.name] = '';
          return acc;
        }, {})
      );
    } catch (err) {
      setError(err.message);
    }
  };

  // --- Helper to render the correct field type ---
  const renderField = (field) => {
    if (field.type === 'select') {
      return (
        <select
          id={field.name}
          name={field.name}
          value={formData[field.name]}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="" disabled>{field.defaultOption}</option>
          {field.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    // Default is a text input
    return (
      <input
        type={field.type}
        id={field.name}
        name={field.name}
        value={formData[field.name]}
        onChange={handleChange}
        required
        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        placeholder={field.placeholder}
      />
    );
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="mb-4 text-xl font-semibold">{title}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {formFields.map((field) => (
          <div key={field.name}>
            <label
              htmlFor={field.name}
              className="block text-sm font-medium text-gray-700"
            >
              {field.label}
            </label>
            {renderField(field)} {/* Use our new helper */}
          </div>
        ))}
        
        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-green-600">{success}</p>}

        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Add {title}
        </button>
      </form>
    </div>
  );
}

export default AddForm;