// Script to test the offers API
// Open browser console on the admin offers page and paste this

const testOffersAPI = async () => {
  const adminToken = localStorage.getItem('adminToken');
  console.log('Admin token:', adminToken ? 'Token exists' : 'NO TOKEN FOUND');

  try {
    const response = await fetch('http://localhost:5000/api/admin/offers', {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    const data = await response.json();
    console.log('Response data:', data);

    return data;
  } catch (error) {
    console.error('API Error:', error);
    return null;
  }
};

// Run the test
testOffersAPI();
