# Task ManagerAPI

### Assignment-01

**Problem Statement** -- Build a RESTful API for a simple task manager application with the following endpoints

|                     Endpoint | Description                                        |
| ---------------------------: | :------------------------------------------------- |
|                 `GET /tasks` | Retrieve all tasks.                                |
|             `GET /tasks/:id` | Retrieve a single task by taskId.                  |
| `GET /tasks/priority/:level` | Retrieve tasks based on priority level. (Optional) |
|                `POST /tasks` | Create a new task.                                 |
|             `PUT /tasks/:id` | Update an existing task by taskId.                 |
|          `DELETE /tasks/:id` | Delete a task by taskId.                           |

#### Tasks

- [x] Use an in-memory data store (e.g., an array) to store the tasks.
- [x] Implement proper error handling for invalid requests.
- [x] Add input validation for task creation and updates. Validate that the title and description are not empty, and that the completion status is a boolean value.
- [x] Test the API using Postman or Curl to ensure it works as expected.

##### Optional Tasks - Done

- [x] Implement filtering and sorting for the `GET /tasks` endpoint. For example, users should be able to filter tasks based on completion status and sort them by creation date.
- [x] Allow users to assign a priority level (e.g., _low_, _medium_, _high_) to each task. Update the API to support this new attribute in task creation, updates, and retrieval.
- [x] Implement an endpoint to retrieve tasks based on priority level: `GET /tasks/priority/:level`.

### Schema

```js
{
  "tasks": [
		{
		  "id": "number",
		  "title": "string",
		  "description": "string",
		  "completed": boolean,
		  "createdAt": Date.now()
		}
	]
}
```

### Tests (using `cURL`)

> (Use the data from [tasks.json file](./src/tasks.json))

1. **`GET /tasks`**

```bash
curl --location "localhost:3000/tasks?completed=false&sort=1"
```

2. **`GET /tasks/:id`**

```bash
curl --location "localhost:3000/tasks/2"
```

3. **`GET /tasks/priority/:level`**

```bash
curl --location "localhost:3000/tasks/priority/high"
```

4. **`POST /tasks`**

```bash
curl --location 'localhost:3000/tasks' \
--header 'Content-Type: application/json' \
--data '{
    "id": 21,
    "title": "Assignemnt",
    "description": "Assignment of task manager",
    "completed": true
}'
```

5. **`DELETE /tasks/:id`**

```bash
curl --location --request DELETE "localhost:3000/tasks/2"
```

6. **`PUT /tasks/:id`**

```bash
curl --location --request PUT 'localhost:3000/tasks/20' \
--header 'Content-Type: application/json' \
--data '{
    "title": "Create test course for assignment",
    "description": "created a cource for first assignment",
    "completed": true,
    "priority": "high"
  }'
```
