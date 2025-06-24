// Temporary test data for reviews - DELETE AFTER TESTING

export const generateTestReviews = (businessId: string) => [
  {
    id: '1',
    business_id: businessId,
    user_id: 'user1',
    rating: 5,
    title: 'Amazing experience!',
    content: 'The food was absolutely incredible and the service was top-notch. I especially loved the ambiance and the attention to detail. Will definitely be coming back!',
    photos: [],
    helpful_count: 12,
    created_at: '2024-01-15T10:30:00Z',
    users: { id: 'user1', name: 'Ahmed Hassan', avatar_url: null }
  },
  {
    id: '2',
    business_id: businessId,
    user_id: 'user2',
    rating: 4,
    title: 'Great place, minor issues',
    content: 'Overall a very good experience. The food quality was excellent and the location is convenient. Only issue was the wait time, but the staff were apologetic and friendly.',
    photos: [],
    helpful_count: 8,
    created_at: '2024-01-10T14:20:00Z',
    users: { id: 'user2', name: 'Fatima Al-Zahra', avatar_url: null }
  },
  {
    id: '3',
    business_id: businessId,
    user_id: 'user3',
    rating: 3,
    title: 'Average experience',
    content: 'It was okay. Nothing special but not bad either. The prices are reasonable for what you get.',
    photos: [],
    helpful_count: 3,
    created_at: '2024-01-08T18:45:00Z',
    users: { id: 'user3', name: 'Omar Khaled', avatar_url: null }
  },
  {
    id: '4',
    business_id: businessId,
    user_id: 'user4',
    rating: 5,
    title: 'Perfect!',
    content: 'Everything was perfect from start to finish. Highly recommend to anyone looking for quality service.',
    photos: [],
    helpful_count: 15,
    created_at: '2024-01-05T12:15:00Z',
    users: { id: 'user4', name: 'Yasmin Farouk', avatar_url: null }
  },
  {
    id: '5',
    business_id: businessId,
    user_id: 'user5',
    rating: 2,
    title: 'Disappointing',
    content: 'Expected much better based on the reviews. Service was slow and the quality did not meet expectations.',
    photos: [],
    helpful_count: 5,
    created_at: '2024-01-03T16:30:00Z',
    users: { id: 'user5', name: 'Mohamed Ali', avatar_url: null }
  },
  {
    id: '6',
    business_id: businessId,
    user_id: 'user6',
    rating: 4,
    title: 'Good value for money',
    content: 'Solid experience overall. Good value for money and friendly staff. Would recommend for casual dining.',
    photos: [],
    helpful_count: 7,
    created_at: '2024-01-01T20:00:00Z',
    users: { id: 'user6', name: 'Layla Ibrahim', avatar_url: null }
  }
]; 