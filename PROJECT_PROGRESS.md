### **Project Progress Description**

**Project Abstract**
The primary goal of this project is to develop "QuickWheelz," a full-stack MERN application for bike rentals. The system allows bike owners to list their bikes and renters to browse and book them. The project's initial scope was to fix bike ownership and location data persistence. The requirements have since evolved to implement a post-booking feature that shows the renter a map with the bike shop's location. A key technical decision was to use an open-source mapping library instead of a paid service like Google Maps API.

**Updated Project Approach and Architecture**
The project uses a standard MERN stack architecture. The backend is built with Node.js and Express.js, using MongoDB for the database with Mongoose as the ODM. Authentication is handled via JWT. The REST API facilitates communication with the frontend for managing users, bikes, and bookings. The frontend is a single-page application built with React, utilizing React Router for navigation and React Context for state management (`AuthContext`). For the mapping functionality, the project has pivoted to using the open-source Leaflet library with React-Leaflet for integration, replacing the initially considered Google Maps API.

---

### **Tasks Completed**

| Task Completed                                                               | Team Member                          |
| :--------------------------------------------------------------------------- | :----------------------------------- |
| Fixed bike creation route to correctly save city, latitude, and longitude.   | Alpesh, Kanishk, Ayush, Shivansh     |
| Added fields for consumer name, ID, and UPI ID to the booking data model.    | Alpesh, Kanishk, Ayush, Shivansh     |
| Implemented the booking creation route to save new consumer details.         | Alpesh, Kanishk, Ayush, Shivansh     |
| Updated Dashboard to handle bike image uploads and display renter details.   | Alpesh, Kanishk, Ayush, Shivansh     |
| Diagnosed and guided resolution for an `EADDRINUSE` server port conflict.     | Alpesh, Kanishk, Ayush, Shivansh     |
| Created a new backend route to fetch all bikes belonging to a specific owner.| Alpesh, Kanishk, Ayush, Shivansh     |
| Installed Leaflet library as a replacement for Google Maps API.              | Alpesh, Kanishk, Ayush, Shivansh     |


---

### **Challenges/Roadblocks**
The project is currently at a standstill due to a critical runtime error in the frontend. When a user attempts to view the details of a bike, the application crashes with an "Objects are not valid as a React child" error in the `BikeDetails.js` component. This was introduced while implementing the location and booking features. This crash blocks the entire booking workflow, making it impossible to proceed with the implementation of the map display, which is the next key feature. The immediate and highest-priority task is to resolve this rendering bug by ensuring component state and props are handled correctly, likely by adding conditional rendering and correctly accessing the nested `city` object property (`bike.city.name`).

---

### **Tasks Pending**

| Task Pending                                                                 | Team Member (to complete the task) |
| :--------------------------------------------------------------------------- | :--------------------------------- |
| **Fix the critical "Objects are not valid as a React child" crash.**         | Alpesh, Kanishk, Ayush, Shivansh   |
| Implement the Leaflet map to correctly display the bike shop's location.     | Alpesh, Kanishk, Ayush, Shivansh   |
| Create a post-booking confirmation page/view that displays the map.          | Alpesh, Kanishk, Ayush, Shivansh   |
| Ensure the end-to-end bike booking flow is functional without errors.        | Alpesh, Kanishk, Ayush, Shivansh   |
| Conduct thorough testing of all user flows (auth, browsing, booking, map).   | Alpesh, Kanishk, Ayush, Shivansh   |

---

### **Project Outcome/Deliverables**
The final deliverable will be a functional bike rental web application where users can register, log in, browse available bikes, and book them. Bike owners will have a dashboard to manage their listings. The key outcome will be a seamless booking experience where, upon confirmation, the renter is immediately shown an interactive map pinpointing the precise location of the bike they have rented for easy pickup.

---

### **Progress Overview**
The project is approximately 50% complete. The backend infrastructure, database models, and most API endpoints are in place. The frontend architecture is set up. However, progress is **blocked and behind schedule** due to the critical rendering bug in `BikeDetails.js`, which prevents the entire booking and mapping functionality from being developed or tested. Resolving this bug is the top priority to get the project back on track.

---

### **Codebase Information**
*   **Repository Information**: A repository link and branch name have not been provided.
*   **Important Information**: The codebase has undergone significant recent changes. Key modifications include:
    *   **Backend**: The `bike` and `booking` models were updated to store richer location and consumer data.
    *   **Frontend**: The project pivoted from Google Maps API to Leaflet. This involved changing dependencies (`package.json`), updating `index.html` to include Leaflet CSS, and modifying components. `BikeDetails.js` has been heavily edited and is the source of the current instability.

---

### **Testing and Validation Status**

| Test Type                     | Status (Pass/Fail) | Notes                                                                                                                              |
| :---------------------------- | :----------------- | :--------------------------------------------------------------------------------------------------------------------------------- |
| **Manual User Testing**       | **Fail**           | The primary user flow (booking a bike) is broken. The application crashes when trying to view bike details, blocking all further testing of the booking and mapping features. |
| **Unit / Integration Tests**  | **N/A**            | No automated testing suite has been implemented for this project. Validation is currently being performed manually.                                  |

---

### **Deliverables Progress**
*   **User Authentication (Login/Signup)**: In Progress
*   **Bike Listing and Browsing**: In Progress (Blocked by crash on details page)
*   **Bike Booking Flow**: Pending (Blocked by crash)
*   **Map Integration with Leaflet**: Pending (Blocked by crash)
*   **Owner Dashboard**: In Progress 