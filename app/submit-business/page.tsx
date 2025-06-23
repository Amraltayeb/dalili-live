import React from 'react';
import SubmissionForm from '@/components/business/SubmissionForm';

const SubmitBusinessPage: React.FC = () => {
  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
      <h1>Submit a New Business</h1>
      <p>Fill out the form below to add a new business to the directory. You must be logged in to submit.</p>
      <SubmissionForm />
    </div>
  );
};

export default SubmitBusinessPage; 