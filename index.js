$(document).ready(function(){
	//BOTON ADD, resetea el formulario a 0, establece el titulo del modal, establece la accion y operación ad y le da la la propiedad html al id: user_uploaded_image
	// #id .clase
	$('#add_button').click(function(){
		$('#user_form')[0].reset();
		$('.modal-title').text("Add User");
		$('#action').val("Add");
		$('#operation').val("Add");
		$('#user_uploaded_image').html('');
	});
	//la tabla tiene el id "user_data" esto lo llama y envia una petición ajax del tipo POST a fetch.php
	var dataTable = $('#user_data').DataTable({
		"processing":true,
		"serverSide":true,
		"order":[],
		"ajax":{
			url:"fetch.php",
			type:"POST"
		},
		"columnDefs":[
			{
				"targets":[0, 3, 4],
				"orderable":false,
			},
		],

	});
//aca le pone el preventDefault para que el formulario no actue como submit
	$(document).on('submit', '#user_form', function(event){
		event.preventDefault();
		var firstName = $('#first_name').val();
		var lastName = $('#last_name').val();
		var extension = $('#user_image').val().split('.').pop().toLowerCase();
		//split divide el string en un arreglo,mientras que pop elima el ultimo elemento del array y lo devuelve junto con toLowerCase en minusculas
		if(extension != '')
		{
			if(jQuery.inArray(extension, ['gif','png','jpg','jpeg']) == -1)
			//si la extension de la imagen no es estos formatos, informa que no es valida
			{
				alert("Invalid Image File");
				$('#user_image').val('');
				return false;
			}
		}	//si hay algo en firsName y en lastName, hace un ajax del tipo POST en insert.php
		if(firstName != '' && lastName != '')
		{
			$.ajax({
				url:"insert.php",
				method:'POST',
				data:new FormData(this),
				contentType:false,
				processData:false,
				success:function(data)
				{
					alert(data);
					$('#user_form')[0].reset();  //recarga el formulario
					$('#userModal').modal('hide');  //mantiene oculto el modal 
					dataTable.ajax.reload();    //recarga la dataTable
				}
			});
		}
		else
		{
			alert("Both Fields are Required"); //si esta vacío el firstName y el lastName alerta esto
		}
	});
	
	$(document).on('click', '.update', function(){
		var user_id = $(this).attr("id");   //$(selector).attr(atributo); ->recibe el valor de la clase UPDATE y permite modificar el valor del ID"
		//ACA EDITA Y CAMBIA 
		$.ajax({
			url:"fetch_single.php",
			method:"POST",
			data:{user_id:user_id},
			dataType:"json",
			success:function(data)
			{
				$('#userModal').modal('show');
				$('#first_name').val(data.first_name);
				$('#last_name').val(data.last_name);
				$('.modal-title').text("Edit User");
				$('#user_id').val(user_id);
				$('#user_uploaded_image').html(data.user_image);
				$('#action').val("Edit");
				$('#operation').val("Edit");
			}
		})
	});
	
	$(document).on('click', '.delete', function(){
		var user_id = $(this).attr("id");
		if(confirm("Are you sure you want to delete this?"))
		{
			$.ajax({
				url:"delete.php",
				method:"POST",
				data:{user_id:user_id},
				success:function(data)
				{
					alert(data);
					dataTable.ajax.reload();
				}
			});
		}
		else
		{
			return false;	
		}
	});
	
	
});