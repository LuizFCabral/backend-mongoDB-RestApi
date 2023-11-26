//const urlBase = 'https://backend-mongodb-pi.vercel.app/api'
const urlBase = "http://localhost:4000/api";
const resultadoModal = new bootstrap.Modal(
	document.getElementById("modalMensagem")
);
const access_token = localStorage.getItem("token") || null;

//evento submit do formulário
document
	.getElementById("formPessoa")
	.addEventListener("submit", function (event) {
		event.preventDefault(); // evita o recarregamento
		const idPessoa = document.getElementById("id").value;
		let pessoa = {};

		if (idPessoa.length > 0) {
			//Se possuir o ID, enviamos junto com o objeto
			pessoa = {
				_id: idPessoa,
				nome: document.getElementById("nome").value,
				altura: document.getElementById("altura").value,
				signo: document.getElementById("signo").value,
				data_nasc: document.getElementById("data_nasc").value,
				qtd_dentes: document.getElementById("qtd_dentes").value,
			};
		} else {
			pessoa = {
				nome: document.getElementById("nome").value,
				altura: document.getElementById("altura").value,
				signo: document.getElementById("signo").value,
				data_nasc: document.getElementById("data_nasc").value,
				qtd_dentes: document.getElementById("qtd_dentes").value,
			};
		}
		salvaPessoa(pessoa);
	});

async function salvaPessoa(pessoa) {
	if (pessoa.hasOwnProperty("_id")) {
		//Se a pessoa tem o id iremos alterar os dados (PUT)
		// Fazer a solicitação PUT para o endpoint dos pessoas
		await fetch(`${urlBase}/pessoas`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				"access-token": access_token, //envia o token na requisição
			},
			body: JSON.stringify(pessoa),
		})
			.then((response) => response.json())
			.then((data) => {
				// Verificar se o token foi retornado
				if (data.acknowledged) {
					alert("✔ Pessoa alterado com sucesso!");
					//Limpar o formulário
					document.getElementById("formPessoa").reset();
					//Atualiza a UI
					carregaPessoas();
				} else if (data.errors) {
					// Caso haja erros na resposta da API
					const errorMessages = data.errors
						.map((error) => error.msg)
						.join("\n");
					// alert("Falha no login:\n" + errorMessages);
					document.getElementById(
						"mensagem"
					).innerHTML = `<span class='text-danger'>${errorMessages}</span>`;
					resultadoModal.show();
				} else {
					document.getElementById(
						"mensagem"
					).innerHTML = `<span class='text-danger'>${JSON.stringify(
						data
					)}</span>`;
					resultadoModal.show();
				}
			})
			.catch((error) => {
				document.getElementById(
					"mensagem"
				).innerHTML = `<span class='text-danger'>Erro ao salvar o pessoa: ${error.message}</span>`;
				resultadoModal.show();
			});
	} else {
		//caso não tenha o ID, iremos incluir (POST)
		// Fazer a solicitação POST para o endpoint dos pessoas
		await fetch(`${urlBase}/pessoas`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"access-token": access_token, //envia o token na requisição
			},
			body: JSON.stringify(pessoa),
		})
			.then((response) => response.json())
			.then((data) => {
				// Verificar se o token foi retornado
				if (data.acknowledged) {
					alert("✔ Pessoa incluído com sucesso!");
					//Limpar o formulário
					document.getElementById("formPessoa").reset();
					//Atualiza a UI
					carregaPessoas();
				} else if (data.errors) {
					// Caso haja erros na resposta da API
					const errorMessages = data.errors
						.map((error) => error.msg)
						.join("\n");
					// alert("Falha no login:\n" + errorMessages);
					document.getElementById(
						"mensagem"
					).innerHTML = `<span class='text-danger'>${errorMessages}</span>`;
					resultadoModal.show();
				} else {
					document.getElementById(
						"mensagem"
					).innerHTML = `<span class='text-danger'>${JSON.stringify(
						data
					)}</span>`;
					resultadoModal.show();
				}
			})
			.catch((error) => {
				document.getElementById(
					"mensagem"
				).innerHTML = `<span class='text-danger'>Erro ao salvar o pessoa: ${error.message}</span>`;
				resultadoModal.show();
			});
	}
}

async function carregaPessoas() {
	const tabela = document.getElementById("dadosTabela");
	tabela.innerHTML = ""; //Limpa a tabela antes de recarregar
	// Fazer a solicitação GET para o endpoint dos pessoas
	await fetch(`${urlBase}/pessoas`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			"access-token": access_token, //envia o token na requisição
		},
	})
		.then((response) => response.json())
		.then((data) => {
			data.forEach((pessoa) => {
				tabela.innerHTML += `
                <tr>
                   <td>${pessoa.nome}</td>
                   <td>${pessoa.altura}</td>
                   <td>${pessoa.signo}</td>
                   <td>${pessoa.data_nasc}</td>                   
                   <td>${pessoa.qtd_dentes}</td>        
                   <td>
                       <button class='btn btn-danger btn-sm' onclick='removePessoa("${pessoa._id}")'>🗑 Excluir </button>
                       <button class='btn btn-warning btn-sm' onclick='buscaPessoaPeloId("${pessoa._id}")'>📝 Editar </button>
                    </td>           
                </tr>
                `;
			});
		})
		.catch((error) => {
			document.getElementById(
				"mensagem"
			).innerHTML = `<span class='text-danger'>Erro ao salvar o pessoa: ${error.message}</span>`;
			resultadoModal.show();
		});
}

async function removePessoa(id) {
	if (confirm("Deseja realmente excluir o pessoa?")) {
		await fetch(`${urlBase}/pessoas/${id}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				"access-token": access_token, //envia o token na requisição
			},
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.deletedCount > 0) {
					//alert('Registro Removido com sucesso')
					carregaPessoas(); // atualiza a UI
				}
			})
			.catch((error) => {
				document.getElementById(
					"mensagem"
				).innerHTML = `<span class='text-danger'>Erro ao salvar o pessoa: ${error.message}</span>`;
				resultadoModal.show();
			});
	}
}

async function buscaPessoaPeloId(id) {
	await fetch(`${urlBase}/pessoas/id/${id}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			"access-token": access_token, //envia o token na requisição
		},
	})
		.then((response) => response.json())
		.then((data) => {
			if (data[0]) {
				//Iremos pegar os dados e colocar no formulário.
				document.getElementById("id").value = data[0]._id;
				document.getElementById("nome").value = data[0].nome;
				document.getElementById("altura").value = data[0].altura;
				document.getElementById("signo").value = data[0].signo;
				document.getElementById("data_nasc").value = data[0].data_nasc;
				document.getElementById("qtd_dentes").value =
					data[0].qtd_dentes;
			}
		})
		.catch((error) => {
			document.getElementById(
				"mensagem"
			).innerHTML = `<span class='text-danger'>Erro ao salvar o pessoa: ${error.message}</span>`;
			resultadoModal.show();
		});
}
