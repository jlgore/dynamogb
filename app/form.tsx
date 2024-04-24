// app/form.tsx

'use client';

import React, { FormEvent, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

interface GuestbookFormProps {
  onSubmit: () => void;
}

const FormContainer = styled.div`
  margin-bottom: 20px;
  padding: 20px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  color: #333;
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: vertical;
  color: #333;
`;

const SubmitButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #ff0000;
  margin-top: 10px;
`;

const GuestbookForm: React.FC<GuestbookFormProps> = ({ onSubmit }) => {
  const [userName, setUserName] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    setSubmitting(true);
    setError('');
  
    try {
      const response = await axios.post('/api/guestbook', { userName, message });
  
      if (response.status === 200) {
        setUserName('');
        setMessage('');
        onSubmit();
        setSubmitting(false);
      } else {
        const errorData = response.data;
        if (errorData.error) {
          throw new Error(errorData.error);
        } else {
          throw new Error('Failed to submit guestbook entry');
        }
      }
    } catch (error) {
      console.error('Error submitting guestbook entry:', error);
      if (axios.isAxiosError(error) && error.response) {
        const errorData = error.response.data;
        if (errorData.error) {
          setError(errorData.error);
        } else {
          setError('Failed to submit guestbook entry. Please try again.');
        }
      } else {
        setError('Failed to submit guestbook entry. Please try again.');
      }
      setSubmitting(false);
    }
  };
  
  return (
    <FormContainer>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="userName">Name:</Label>
          <Input
            type="text"
            id="userName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="message">Message:</Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={4}
          ></Textarea>
        </FormGroup>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <SubmitButton type="submit" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit'}
        </SubmitButton>
      </form>
    </FormContainer>
  );
};

export default GuestbookForm;