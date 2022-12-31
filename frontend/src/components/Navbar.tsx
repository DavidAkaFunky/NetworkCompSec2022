import {
	AppBar,
	Box,
	Button,
	Container,
	Divider,
	IconButton,
	Menu,
	MenuItem,
	Toolbar,
	Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
import useAuth from "../hooks/useAuth";
import useLogout from "../hooks/useLogout";

function Navbar() {
	const { auth } = useAuth();
	const logout = useLogout();
	const navigate = useNavigate();

	const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
	const [anchorElUserSettings, setAnchorElUserSettings] =
		useState<null | HTMLElement>(null);
	const open = Boolean(anchorElUserSettings);
	return (
		<AppBar position="static">
			<Container maxWidth={false}>
				<Toolbar disableGutters>
					<AccountBalanceIcon
						sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
					/>
					<Typography
						variant="h6"
						noWrap
						component="a"
						href="/"
						sx={{
							mr: 2,
							display: { xs: "none", md: "flex" },
							fontFamily: "monospace",
							fontWeight: 700,
							letterSpacing: ".3rem",
							color: "inherit",
							textDecoration: "none",
						}}
					>
						NCMB
					</Typography>

					<Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
						<IconButton
							size="large"
							aria-label="menu"
							aria-controls="menu-appbar"
							aria-haspopup="true"
							onClick={(e) => setAnchorElNav(e.currentTarget)}
							color="inherit"
						>
							<MenuIcon />
						</IconButton>
						<Menu
							id="menu-appbar"
							anchorEl={anchorElNav}
							anchorOrigin={{
								vertical: "bottom",
								horizontal: "left",
							}}
							keepMounted
							transformOrigin={{
								vertical: "top",
								horizontal: "left",
							}}
							open={Boolean(anchorElNav)}
							onClose={() => setAnchorElNav(null)}
							sx={{
								display: { xs: "block", md: "none" },
							}}
						>
							<MenuItem
								onClick={() => {
									setAnchorElNav(null);
									navigate("/");
								}}
							>
								<Typography textAlign="center">Landing</Typography>
							</MenuItem>
							{auth.isLoggedIn && (
								<>
									<MenuItem
										onClick={() => {
											setAnchorElNav(null);
											navigate("/home");
										}}
									>
										<Typography textAlign="center">Home</Typography>
									</MenuItem>
										<MenuItem
										onClick={() => {
											setAnchorElNav(null);
											navigate("/change-password");
										}}
									>
										<Typography textAlign="center">Change Password</Typography>
									</MenuItem>
								</>
							)}
							{(auth.role === "ADMIN" || auth.role === "SUPERADMIN") && (
								<>
									<MenuItem
										onClick={() => {
											setAnchorElNav(null);
											navigate("/admin");
										}}
									>
										<Typography textAlign="center">Admin</Typography>
									</MenuItem>
									<MenuItem
										onClick={() => {
											setAnchorElNav(null);
											navigate("/register-admin");
										}}
									>
										<Typography textAlign="center">Register admin</Typography>
									</MenuItem>
								</>
							)}
						</Menu>
					</Box>
					<AccountBalanceIcon
						sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
					/>
					<Typography
						variant="h5"
						noWrap
						component="a"
						href="/"
						sx={{
							mr: 2,
							display: { xs: "flex", md: "none" },
							flexGrow: 1,
							fontFamily: "monospace",
							fontWeight: 700,
							letterSpacing: ".3rem",
							color: "inherit",
							textDecoration: "none",
						}}
					>
						NCMB
					</Typography>
					<Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
						<Button
							onClick={() => {
								setAnchorElNav(null);
								navigate("/");
							}}
							sx={{ my: 2, color: "inherit" }}
						>
							Landing
						</Button>
						<Button
							onClick={() => {
								setAnchorElNav(null);
								navigate("/ca");
							}}
							sx={{ my: 2, color: "inherit" }}
						>
							Certification Authority
						</Button>
						{auth.isLoggedIn && (
							<Button
								onClick={() => {
									setAnchorElNav(null);
									navigate("/home");
								}}
								sx={{ my: 2, color: "inherit" }}
							>
								Home
							</Button>
						)}
						{(auth.role === "ADMIN" || auth.role === "SUPERADMIN") && (
							<Button
								onClick={() => {
									setAnchorElNav(null);
									navigate("/admin");
								}}
								sx={{ my: 2, color: "inherit" }}
							>
								Admin
							</Button>
						)}
					</Box>
					{!auth.isLoggedIn && (
						<>
							<Button
								onClick={() => navigate("/login")}
								sx={{ my: 2, color: "inherit" }}
							>
								Login
							</Button>
							<Button
								onClick={() => navigate("/register")}
								sx={{ my: 2, color: "inherit" }}
							>
								Register
							</Button>
						</>
					)}
					{auth.isLoggedIn && (
						<React.Fragment>
							<IconButton
								onClick={(e) => setAnchorElUserSettings(e.currentTarget)}
								size="small"
								sx={{ ml: 2 }}
								aria-controls={open ? "account-menu" : undefined}
								aria-haspopup="true"
								aria-expanded={open ? "true" : undefined}
							>
								<Typography sx={{ mr: 1 }}>{auth.username}</Typography>
								<AccountCircleIcon fontSize="large" />
							</IconButton>
							<Menu
								anchorEl={anchorElUserSettings}
								id="account-menu"
								open={open}
								onClose={(e) => setAnchorElUserSettings(null)}
								onClick={(e) => setAnchorElUserSettings(null)}
								PaperProps={{
									elevation: 0,
									sx: {
										overflow: "visible",
										filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
										mt: 1.5,
										"& .MuiAvatar-root": {
											width: 32,
											height: 32,
											ml: -0.5,
											mr: 1,
										},
										"&:before": {
											content: '""',
											display: "block",
											position: "absolute",
											top: 0,
											right: 14,
											width: 10,
											height: 10,
											bgcolor: "background.paper",
											transform: "translateY(-50%) rotate(45deg)",
											zIndex: 0,
										},
									},
								}}
								transformOrigin={{ horizontal: "right", vertical: "top" }}
								anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
							>
								<MenuItem>
									<Typography sx={{ mx: 2 }}>Profile</Typography>
								</MenuItem>
								<Divider />
								<MenuItem
									onClick={() => {
										logout().then(() => {
											setAnchorElUserSettings(null);
										})
									}}
								>
									<LogoutIcon sx={{ mr: 1 }} />
									Logout
								</MenuItem>
							</Menu>
						</React.Fragment>
					)}
				</Toolbar>
			</Container>
		</AppBar>
	);
}

export default Navbar;
