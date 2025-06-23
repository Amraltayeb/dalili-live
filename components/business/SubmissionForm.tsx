"use client";
import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { businessSubmissionSchema, BusinessSubmissionData } from '@/lib/validations';
import { uploadBusinessPhoto } from '@/lib/photo-upload';
import { getCurrentUser, getCategories, getAreas } from '@/lib/dal';
import { Category, Area } from '@/lib/types';

// --- Helper Components for better UI ---
const FormSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="space-y-4 bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        {children}
    </div>
);

const Input = React.forwardRef<HTMLInputElement, any>((props, ref) => (
    <input ref={ref} {...props} className="input w-full border-gray-300 rounded-md shadow-sm" />
));

const Textarea = React.forwardRef<HTMLTextAreaElement, any>((props, ref) => (
    <textarea ref={ref} {...props} className="input w-full border-gray-300 rounded-md shadow-sm" rows={4} />
));

const Select = React.forwardRef<HTMLSelectElement, any>(({ children, ...props }, ref) => (
    <select ref={ref} {...props} className="input w-full border-gray-300 rounded-md shadow-sm">
        {children}
    </select>
));

const SubmissionForm: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [step, setStep] = useState(0);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);

  const methods = useForm<BusinessSubmissionData>({
    resolver: zodResolver(businessSubmissionSchema),
    mode: 'onBlur',
  });

  useEffect(() => {
    getCurrentUser().then(setUser);
    getCategories().then(setCategories);
    getAreas().then(setAreas);
  }, []);

  if (!user) return <div>Please log in to submit a business.</div>;

  const onSubmit = async (data: BusinessSubmissionData) => {
    setSubmitting(true);
    setError(null);
    try {
      // Upload photos with error handling
      let photoUrls: string[] = [];
      if (photoFiles.length > 0) {
        setUploadingPhotos(true);
        try {
          photoUrls = await Promise.all(
            photoFiles.map((file, idx) => uploadBusinessPhoto(file, user.id, idx))
          );
        } catch (uploadError) {
          console.error('Photo upload failed:', uploadError);
          setError('Some photos failed to upload. Please try again or submit without photos.');
          setSubmitting(false);
          setUploadingPhotos(false);
          return;
        } finally {
          setUploadingPhotos(false);
        }
      }
      
      // Submit form data to API
      const response = await fetch('/api/businesses/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, photos: photoUrls }),
      });
      if (!response.ok) throw new Error('Submission failed');
      setSuccess(true);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Simple multi-step logic (expand as needed)
  const steps = [
    <div key="info">
      <label>Business Name
        <input {...methods.register('businessName')} />
      </label>
      <label>Business Name (Arabic)
        <input {...methods.register('businessNameAr')} />
      </label>
      <label>Description
        <textarea {...methods.register('description')} />
      </label>
      <label>Description (Arabic)
        <textarea {...methods.register('descriptionAr')} />
      </label>
      <div>
        <label>Category</label>
        <Select {...methods.register('categoryId')}>
          <option value="">Select a category</option>
          {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name_en}</option>)}
        </Select>
      </div>
      <label>Phone
        <input {...methods.register('phone')} />
      </label>
      <label>Email
        <input {...methods.register('email')} />
      </label>
      <button type="button" onClick={() => setStep(1)}>Next</button>
    </div>,
    <div key="location">
      <label>Address
        <input {...methods.register('address')} />
      </label>
      <div>
        <label>Area</label>
        <Select {...methods.register('area')}>
          <option value="">Select an area</option>
          {areas.map(area => <option key={area.id} value={area.name_en}>{area.name_en}</option>)}
        </Select>
      </div>
      <label>Governorate
        <input {...methods.register('governorate')} />
      </label>
      <label>Latitude
        <input type="number" step="any" {...methods.register('latitude')} />
      </label>
      <label>Longitude
        <input type="number" step="any" {...methods.register('longitude')} />
      </label>
      <button type="button" onClick={() => setStep(0)}>Back</button>
      <button type="button" onClick={() => setStep(2)}>Next</button>
    </div>,
    <div key="photos">
      <label>Photos
        <input type="file" multiple accept="image/*" onChange={e => setPhotoFiles(Array.from(e.target.files || []))} />
      </label>
      <button type="button" onClick={() => setStep(1)}>Back</button>
      <button type="submit">Submit</button>
    </div>
  ];

  if (success) return <div>Business submitted successfully! Pending admin approval.</div>;

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
        <FormSection title="Basic Information">
          <div>
            <label>Business Name</label>
            <Input {...methods.register('businessName')} />
          </div>
          <div>
            <label>Business Name (Arabic)</label>
            <Input {...methods.register('businessNameAr')} />
          </div>
          <div>
            <label>Description</label>
            <Textarea {...methods.register('description')} />
          </div>
          <div>
            <label>Description (Arabic)</label>
            <Textarea {...methods.register('descriptionAr')} />
          </div>
        </FormSection>

        <FormSection title="Category & Contact">
          <div>
            <label>Category</label>
            <Select {...methods.register('categoryId')}>
              <option value="">Select a category</option>
              {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name_en}</option>)}
            </Select>
          </div>
          <div>
            <label>Phone</label>
            <Input {...methods.register('phone')} />
          </div>
          <div>
            <label>Email</label>
            <Input {...methods.register('email')} />
          </div>
        </FormSection>

        <FormSection title="Location">
          <div>
            <label>Area</label>
            <Select {...methods.register('area')}>
              <option value="">Select an area</option>
              {areas.map(area => <option key={area.id} value={area.name_en}>{area.name_en}</option>)}
            </Select>
          </div>
          <div>
            <label>Address</label>
            <Input {...methods.register('address')} />
          </div>
          <div>
            <label>Governorate</label>
            <Input {...methods.register('governorate')} />
          </div>
          <div>
            <label>Latitude</label>
            <Input type="number" step="any" {...methods.register('latitude')} />
          </div>
          <div>
            <label>Longitude</label>
            <Input type="number" step="any" {...methods.register('longitude')} />
          </div>
        </FormSection>

        <FormSection title="Photos & Hours">
          <div>
            <label>Photos</label>
            <input type="file" multiple accept="image/*" onChange={e => setPhotoFiles(Array.from(e.target.files || []))} />
          </div>
        </FormSection>

        {error && <div style={{ color: 'red' }}>{error}</div>}
        {submitting && <div>Submitting...</div>}
        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  );
};

export default SubmissionForm; 