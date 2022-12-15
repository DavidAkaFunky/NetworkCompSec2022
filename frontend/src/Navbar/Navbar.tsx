import {
	AppBar,
	Avatar,
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
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
//import SettingsIcon from '@mui/icons-material/Settings';
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext/UserContext";
import { UserContextType } from "../UserContext/UserContextType";
import React from "react";

function Navbar() {
	const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
	const [anchorElUserSettings, setAnchorElUserSettings] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorElUserSettings);

	const { user } = useContext(UserContext) as UserContextType;

	const navigate = useNavigate();

	const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElNav(event.currentTarget);
	};


	const handleCloseNavMenu = () => {
		setAnchorElNav(null);
	};

	const handleOpenUserSettings = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElUserSettings(event.currentTarget);
	};
	const handleCloseUserSettings = () => {
		setAnchorElUserSettings(null);
	};

	const handleNavigation = (path: string) => {
		navigate(path);
	};

	const handleLogout = () => {
		user.isLoggedIn=false;	
	};

	return (
		<AppBar position="static">
			<Container maxWidth={false}>
				<Toolbar disableGutters >
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
							onClick={handleOpenNavMenu}
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
							onClose={handleCloseNavMenu}
							sx={{
								display: { xs: "block", md: "none" },
							}}
						>
							<MenuItem
								onClick={() => {
									handleCloseNavMenu();
									handleNavigation("/");
								}}
							>
								<Typography textAlign="center">Landing</Typography>
							</MenuItem>
							{user.isLoggedIn && (
								<MenuItem
									onClick={() => {
										handleCloseNavMenu();
										handleNavigation("/home");
									}}
								>
									<Typography textAlign="center">Home</Typography>
								</MenuItem>
							)}
							{user.isAdmin && (
								<MenuItem
									onClick={() => {
										handleCloseNavMenu();
										handleNavigation("/admin");
									}}
								>
									<Typography textAlign="center">Admin</Typography>
								</MenuItem>
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
								handleCloseNavMenu();
								handleNavigation("/");
							}}
							sx={{ my: 2, color: "inherit" }}
						>
							Landing
						</Button>
						{user.isLoggedIn && (
							<Button
								onClick={() => {
									handleCloseNavMenu();
									handleNavigation("/home");
								}}
								sx={{ my: 2, color: "inherit" }}
							>
								Home
							</Button>
						)}
						{user.isAdmin && (
							<Button
								onClick={() => {
									handleCloseNavMenu();
									handleNavigation("/admin");
								}}
								sx={{ my: 2, color: "inherit" }}
							>
								Admin
							</Button>
						)}
					</Box>
					{!user.isLoggedIn && (
						<Button
							onClick={() => handleNavigation("/login")}
							sx={{ my: 2, color: "inherit" }}
						>
							Login
						</Button>
					)}
					{user.isLoggedIn && (
						<React.Fragment>
							<IconButton
								onClick={handleOpenUserSettings}
								size="small"
								sx={{ ml: 2 }}
								aria-controls={open ? 'account-menu' : undefined}
								aria-haspopup="true"
								aria-expanded={open ? 'true' : undefined}
							>
								<Typography sx={{ mr: 1 }}>{user.username}</Typography>
								<AccountCircleIcon fontSize="large" />
							</IconButton>
							<Menu
								anchorEl={anchorElUserSettings}
								id="account-menu"
								open={open}
								onClose={handleCloseUserSettings}
								onClick={handleCloseUserSettings}
								PaperProps={{
									elevation: 0,
									sx: {
										overflow: 'visible',
										filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
										mt: 1.5,
										'& .MuiAvatar-root': {
											width: 32,
											height: 32,
											ml: -0.5,
											mr: 1,
										},
										'&:before': {
											content: '""',
											display: 'block',
											position: 'absolute',
											top: 0,
											right: 14,
											width: 10,
											height: 10,
											bgcolor: 'background.paper',
											transform: 'translateY(-50%) rotate(45deg)',
											zIndex: 0,
										},
									},
								}}
								transformOrigin={{ horizontal: 'right', vertical: 'top' }}
								anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
							>
								<MenuItem>
									<Typography sx={{ mx: 2 }}>Profile</Typography>
								</MenuItem>
								<Divider />
								{/*<MenuItem>
									<SettingsIcon />
									Settings
								</MenuItem>*/}
								<MenuItem
									onClick={() => {
										handleCloseUserSettings();
										handleLogout();
									}}
								>
									<LogoutIcon sx={{ mr: 1 }}/>
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
