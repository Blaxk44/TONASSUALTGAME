// Edge function for admin panel authentication
export default async (request, context) => {
  const url = new URL(request.url);
  
  // Protect admin-panel.html
  if (url.pathname === '/admin-panel.html') {
    // Basic authentication
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return new Response('Authentication required', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Admin Access", charset="UTF-8"'
        }
      });
    }
    
    // Decode credentials
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = atob(base64Credentials);
    const [username, password] = credentials.split(':');
    
    // Check credentials (update with your actual credentials)
    const validUsername = 'admin';
    const validPassword = 'Asdfghjkl@123'; // CHANGE THIS!
    
    if (username !== validUsername || password !== validPassword) {
      return new Response('Invalid credentials', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Admin Access", charset="UTF-8"'
        }
      });
    }
  }
  
  // Allow the request to continue
  return context.next();
};