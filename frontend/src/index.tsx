import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import App from "./App";
import UserProvider from "./UserContext/UserContext";

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);

root.render(
	<BrowserRouter>
		<React.StrictMode>
      		<CssBaseline />
			<UserProvider>
				<App />
			</UserProvider>
		</React.StrictMode>
	</BrowserRouter>
);
