import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import App from "./App";
import AuthProvider from "./context/AuthContext";
import { WithAxios } from "./interceptors/Axios";

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);

root.render(
	<BrowserRouter>
		<React.StrictMode>
			<CssBaseline />
			<AuthProvider>
				<WithAxios>
					<App />
				</WithAxios>
			</AuthProvider>
		</React.StrictMode>
	</BrowserRouter>
);
