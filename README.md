### Job Search App - Backend (Node.js, Mongoose)

#### v1.0.0 - Initial Release
- **User Management:**
  - User registration with unique email, mobile number, and username.
  - Role-based authentication (User, Company_HR) with JWT.
  - Password management including update and recovery via OTP.
  - User profile management and soft-delete functionality.
  
- **Company Management:**
  - Add, update, delete companies with authorization (Company_HR role).
  - Manage company data such as name, description, and employee count.
  
- **Job Management:**
  - Add, update, delete jobs by authorized company HR users.
  - Filter jobs by working time, location, seniority level, and skills.
  
- **Application Management:**
  - Apply to jobs with technical and soft skills, along with resume upload (Cloudinary).
  - Fetch applications per job, viewable only by the job’s company HR.

- **Revenues:**
  - Get the total revenues for all members or specific trainers.
  
#### v1.1.0 - API Enhancements
- Added company search by name and listing all jobs associated with a company.
- Enhanced error handling for membership expiration and input validation.
- Added role-based access to restrict viewing of applications and user data.
