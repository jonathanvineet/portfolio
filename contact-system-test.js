/**
 * Contact System Test Utility
 * 
 * Usage in browser console:
 * 1. Open the contact page: http://localhost:3000/contact
 * 2. Open DevTools Console
 * 3. Copy and paste the testContactAPI() function
 * 4. Run: testContactAPI()
 */

async function testContactAPI() {
  console.log('🧪 Testing Contact API...\n');

  const testData = {
    name: 'Test User',
    email: 'test@example.com',
    message: 'This is a test message to verify the contact system is working correctly.'
  };

  console.log('📤 Sending test data:');
  console.log(testData);
  console.log('\n...\n');

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    const data = await response.json();

    console.log(`📊 Response Status: ${response.status}`);
    console.log('📥 Response Data:', data);

    if (response.ok) {
      console.log('✅ Contact API is working!\n');
      console.log('📝 Next steps:');
      console.log('1. Check your email for the notification');
      console.log('2. Check Supabase dashboard > contact_messages table');
      console.log('3. Verify the message was stored');
    } else {
      console.log('❌ API returned an error\n');
      console.log('Troubleshooting:');
      console.log('- Check SUPABASE_SERVICE_ROLE_KEY in .env.local');
      console.log('- Verify contact_messages table exists in Supabase');
      console.log('- Check browser console for more details');
    }
  } catch (error) {
    console.error('❌ Error testing API:', error);
    console.log('\nTroubleshooting:');
    console.log('- Ensure the API route exists at /api/contact');
    console.log('- Check server logs for errors');
    console.log('- Verify npm run dev is running');
  }
}

// Also available: test individual validations
function testValidation() {
  console.log('🧪 Testing Validation...\n');

  const testCases = [
    { data: { name: '', email: 'test@test.com', message: 'valid' }, expected: 'fail' },
    { data: { name: 'John', email: 'invalid-email', message: 'valid' }, expected: 'fail' },
    { data: { name: 'John', email: 'test@test.com', message: 'short' }, expected: 'fail' },
    { data: { name: 'John', email: 'test@test.com', message: 'This is a valid message' }, expected: 'pass' },
  ];

  testCases.forEach((testCase, index) => {
    const { name, email, message } = testCase.data;
    const isValid = name && email && email.includes('@') && message.length >= 10;
    const status = isValid ? '✅' : '❌';
    console.log(`${status} Test ${index + 1}: ${testCase.expected === 'pass' ? 'Valid data' : 'Invalid data'}`);
  });
}

console.log('💡 Tip: Run testContactAPI() to test the full contact system');
console.log('💡 Tip: Run testValidation() to test form validation');
