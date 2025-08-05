```mermaid

sequenceDiagram
    participant User
    participant Browser

    User->>Browser: Writing in the input the new note and clicking save
    
    participant Server

    Browser->>Server: HTTP POST:https://studies.cs.helsinki.fi/exampleapp/new_note
    activate Server
    Server-->>Browser: Location: /exampleapp/notes
    deactivate Server
    Note right of Server: Server says to the Browser <br/> to reload the page

    Browser->>Server: HTTP GET:https://studies.cs.helsinki.fi/exampleapp/notes
    activate Server
    Server-->>Browser:HTML document
    deactivate Server

    Browser->>Server: HTTP GET:https://studies.cs.helsinki.fi/exampleapp/main.css
    activate Server
    Server-->>Browser: CSS file
    deactivate Server

    Browser->>Server: HTTP GET:https://studies.cs.helsinki.fi/exampleapp/main.js
    activate Server
    Server-->>Browser:Javascript file
    deactivate Server
    Note left of Browser: The Browser executes the Javascript code <br/> that fetches the JSON from the server

    Browser->>Server: HTTP GET:https://studies.cs.helsinki.fi/exampleapp/data.json
    activate Server
    Server-->>Browser: [{"content":"Hello", "date":"2025-08-05"},...]
    deactivate Server
    Note left of Browser: Browser executes the callback <br/> function that renders the notes

    Browser->>User: The user sees the updated list of notes 

 ```