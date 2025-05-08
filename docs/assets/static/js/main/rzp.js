
$('#lifebook_gt_clk').click(function(e){
	e.preventDefault();
	var options = {
		"key": sessionStorage.getItem('user_temp_key'), // Enter the Key ID generated from the Dashboard
		"amount": sessionStorage.getItem('user_temp_amount'), // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
		"currency": "INR",
		"name": "EdBuddy",
		"description": "Your Buddy for Education",
		"image": "https://www.edbuddy.in/static/frontf/assets/static/images/home/edbuddy_logo.png",
		"order_id": sessionStorage.getItem('user_temp_order_id'), //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
		"handler": function (response){
			document.getElementById('loader').classList.remove('s-none');
			ajax_ServerCall3(response.razorpay_payment_id,response.razorpay_order_id,response.razorpay_signature);
		},
		"prefill": {
			"name": sessionStorage.getItem('user_temp_name'),
			"email": sessionStorage.getItem('user_temp_email'),
			"contact": sessionStorage.getItem('user_temp_contact')
		},
		"notes": {
			"address": "EdBuddy India"
		},
		"theme": {
			"color": "#3399cc"
		}
	};
	sessionStorage.removeItem('user_temp_key');
	sessionStorage.removeItem('user_temp_order_id');
	var rzp1 = new Razorpay(options);
	document.getElementById('loader').classList.add('s-none');
	rzp1.on('payment.failed', function (response){
		document.getElementById('loader').classList.add('s-none');
		$('#pmnt_fail_err').css('display','block');
		setTimeout(function(){
			$('#pmnt_fail_err').css('display','none');
		},5000);
	});
	rzp1.open();
});

function ajax_ServerCall3(a1,a2,a3){
    var data = {
		user_id:sessionStorage.getItem('user_temp_id'),
        payment_id:a1,
        order_id:a2,
        signature:a3
    }
    var st = false;
    $.ajax({
        type: "POST",
        url: "https://www.edbuddy.in/api/p/lifebook/complete_order/",
        data: JSON.stringify(data),
        contentType: 'application/json',
        dataType: "json",
        async: false,
		headers: { 'Authorization': 'Token '.concat(localStorage.getItem('token')) },
        success: function(resultData){
			var res = resultData;
			document.getElementById('paymentSec').classList.add('s-none');
			document.getElementById('paymentComplete').classList.remove('s-none');
			document.getElementById('loader').classList.add('s-none');
			$('#delivery_date').text = res.delivery_date;

        },
        error : function(err) {
            $('#pmnt_fail_err').css('display','block');
            setTimeout(function(){
                $('#pmnt_fail_err').css('display','none');
            },5000);
			document.getElementById('loader').classList.add('s-none');
         }
    });
    return st;
}