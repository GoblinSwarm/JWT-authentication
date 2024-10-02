const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			]
		},
		actions: {
			login: async (email, password) => {
				try {
					let response = await fetch(process.env.BACKEND_URL + "/api/login", {
						method: "POST",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify({
							email: email,
							password: password
						})
					});
					
					if (response.ok) {
						let data = await response.json();
						sessionStorage.setItem("token", data.token); 
						return { success: true };
					} else if (response.status === 401) {
						return { success: false, message: "Unauthorized: Invalid credentials" };
					} else {
						console.log("unexpected error occurred on login", response.status);
						return { success: false, message: "Unexpected error occurred" };
					}
				} catch (error) {
					console.log("There was an error during login", error);
					return { success: false, message: "Network error occurred" };
				}
			},
			signUp: async(email, password) => {
				try{
					let response = await fetch(process.env.BACKEND_URL + "/api/signup",{
						method:"POST",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify({
							email: email, password: password
						})
					});
					const data = await response.json();
					console.log(data);
					return data;
				}catch(error){
					console.log("There was a error during sign up", error);
					throw error;	
				}
			},
			goPrivate: async () => {
				const token = sessionStorage.getItem("token");
				if (!token) {
					return { authenticated: false }; // Cambiado a un objeto para incluir más información
				}
			
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/private`, {
						headers: { Authorization: `Bearer ${token}` }
					});
			
					if (!response.ok) {
						console.error(`Error: ${response.status} - ${response.statusText}`);
						return { authenticated: false }; // Retorna objeto con autenticación falsa
					}
			
					const data = await response.json();
					console.log("Response Data:", data)
					return { authenticated: true, email: data.email }; 
				} catch (error) {
					console.error("Error while checking private access", error);
					return { authenticated: false }; // En caso de error
				}
			}
		}
	};
};

export default getState;