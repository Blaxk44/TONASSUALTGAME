// Function to update user data (admin operations)
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  // Check if user is authenticated as admin
  const sessionCookie = event.headers.cookie || '';
  if (!sessionCookie.includes('admin_session=')) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Unauthorized' })
    };
  }
  
  try {
    const { action, userId, amount, reason } = JSON.parse(event.body);
    
    // Firebase configuration
    const firebaseConfig = {
      apiKey: "AIzaSyBOETGieVSUrO9Bx52Eml3Kf0kAXYKiP1c",
      projectId: "ton-assault-game"
    };
    
    let result;
    
    switch (action) {
      case 'gift_ton':
        // Update user's TON balance in Firebase
        result = await updateFirebaseUser(userId, { 
          ton: `increment:${parseFloat(amount)}` 
        });
        break;
        
      case 'ban_user':
        result = await updateFirebaseUser(userId, { 
          status: 'banned',
          banReason: reason,
          bannedAt: new Date().toISOString()
        });
        break;
        
      case 'reset_user':
        result = await updateFirebaseUser(userId, {
          hp: 100,
          level: 1,
          ton: 0,
          energy: 0,
          resetAt: new Date().toISOString()
        });
        break;
        
      default:
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Invalid action' })
        };
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: `Action ${action} completed for user ${userId}`,
        data: result
      })
    };
    
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal server error',
        details: error.message
      })
    };
  }
};

async function updateFirebaseUser(userId, updates) {
  // This would make actual Firebase API calls
  // For now, return mock success
  return {
    userId,
    updates,
    timestamp: new Date().toISOString(),
    success: true
  };
}