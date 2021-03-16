"""
Main entry point to the app. Finds the app instance and run it on the designated port.
"""

import uvicorn

if __name__ == "__main__":
    uvicorn.run("server.app:app", host="0.0.0.0", port=8000, reload=True)