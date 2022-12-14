import {
	AppBar,
	Box,
	Button,
	Container,
	IconButton,
	Menu,
	MenuItem,
	Toolbar,
	Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext/UserContext";
import { UserContextType } from "../UserContext/UserContextType";

function Navbar() {
	const { user } = useContext(UserContext) as UserContextType;

	const navigate = useNavigate();

	const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

	const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElNav(event.currentTarget);
	};

	const handleCloseNavMenu = () => {
		setAnchorElNav(null);
	};

	const handleNavigation = (path: string) => {
		navigate(path);
	};

	return (
		<AppBar position="static">
			<Container maxWidth="xl">
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
							aria-label="account of current user"
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
					<Button
						onClick={() => handleNavigation("/login")}
						sx={{ my: 2, color: "inherit" }}
					>
						Login
					</Button>
				</Toolbar>
			</Container>
		</AppBar>
	);
}

export default Navbar;
