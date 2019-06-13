var languageDesObject = {
	'vi': {
		'ConfirmCode': 'Mã xác nhận',
		'Back': 'Quay lại',
		'SendCode': 'Gửi',
		'NotInputText': 'Vui lòng nhập mã',
		'GetCodePrompt': 'Vui lòng lấy mã xác nhận trong game để điền vào đây (tìm đến phần cài đặt bảo mật OTP APP), tài khoản của bạn sẽ được cài đặt OTP tự động.',
		'UserExisted': 'Tài khoản {username} đã tồn tại',
		'DeleteAccount': 'Xóa tài khoản',
		'DeleteAccountConfirm': 'Tài khoản này sẽ bị xóa vĩnh viễn và không thể được khôi phục. Nếu bạn thực sự muốn xóa tài khoản này vui lòng nhập lại Tên tài khoản ở đây để xác nhận:',
		'Username': 'Tên tài khoản',
		'DeleteAccountSuccess': 'Đã xóa tài khoản thành công.',
		'AddAccountSuccess': 'Đã Thêm tài khoản thành công.',
		'IncorrectCode': 'Mã không đúng',
		'IncorrectTime': 'Thời gian trên máy của bạn bị sai',
		'IncorrectTimeMessage': 'Vui lòng cài đặt lại thời gian trên thiết bị của bạn nếu không chúng tôi không thể tạo ra mã OTP chính xác',
		'NetworkError': 'Lỗi mạng',
		'NetworkErrorPromt': 'Không thể kết nối tới server game ({serverAddress}), vui lòng kiểm tra lại đường truyền của bạn.'
	},
	'en': {
		'ConfirmCode': 'Confirmation code',
		'Back': 'Back',
		'SendCode': 'Send',
		'NotInputText': 'Confirmation code empty',
		'GetCodePrompt': 'Please logging in the game, open your profile page, click REG APP OTP button then follow the instruction to get confirmation code',
		'UserExisted': 'Account of {username} existed',
		'DeleteAccount': 'Delete account',
		'DeleteAccountConfirm': 'Your account will be deleted permanently. If you want to delete your otp for this account, enter the account name here:',
		'Username': 'Username',
		'DeleteAccountSuccess': 'Your OTP account was deleted!',
		'AddAccountSuccess': 'Your OTP account was added successfully!',
		'IncorrectCode': 'Incorrect confirmation code',
		'IncorrectTime': 'Your time on this device is not current time',
		'IncorrectTimeMessage': 'Please set your time to current time or we cannot genrate correct OTP.',
		'NetworkError': 'Network error',
		'NetworkErrorPromt': 'Cannot connect to game server ({serverAddress}), check your internet connection and try again.'
	},
	'lo': {
		'ConfirmCode': 'ລະຫັດຢັ້ງຢືນ',
		'Back': 'ກັບຄືນ',
		'SendCode': 'ສົ່ງລະຫັດ',
		'NotInputText': 'ຍັງບໍໄດ້ໃສ່ລະຫັດ',
		'GetCodePrompt': 'ກະລຸນາເຂົ້າສູ່ເກມ, ເປີດຫນ້າໂປຣໄຟລຂອງທ່ານ, ກົດປຸ່ມ REG APP AN ແລະເຮັດຕາມຄໍາແນະນໍາເພື່ອຮັບລະຫັດຢືນຢັນ',
		'UserExisted': 'ບັນຊີ {username} ທີ່ຄົງຄ້າງແລ້ວ',
		'DeleteAccount': 'ລຶບບັນຊີ',
		'DeleteAccountConfirm': 'ບັນຊີນີ້ຈະຖືກລຶບຖາວອນແລະບໍ່ສາມາດຟື້ນຟູໄດ້.ຖ້າທ່ານຢາກການລຶບບັນຊີນີ້ກະລຸນາໃສ່ຄືນຊື່ບັນຊີຂອງທ່ານຢູ່ນີ້ເພື່ອຢືນຢັນ:',
		'Username': 'ຊື່ບັນຊີ',
		'DeleteAccountSuccess': 'ບັນຊີຖືກລຶບແລ້ວແລ້ວ!',
		'AddAccountSuccess': 'ບັນຊີທີ່ປະສົບຄວາມສໍາເລັດເພີ່ມ!',
		'IncorrectCode': 'ລະຫັດບໍຖຶກ',
		'IncorrectTime': 'ໂມງໃນໂທລະສັບຂອງທ່ານຖຶກຜິດ',
		'IncorrectTimeMessage': 'ກະລຸນາຕັ້ງຄ່າເວລາໃນອຸປະກອນຂອງທ່ານອີກຄັ້ງຖ້າບໍ່ດັ່ງນັ້ນພວກເຮົາບໍ່ສາມາດສ້າງລະຫັດ OTP ທີ່ຖືກຕ້ອງ.',
		'NetworkError': 'ບໍມີເນັດ',
		'NetworkErrorPromt': 'ບໍ່ສາມາດເຊື່ອມຕໍ່ກັບເກມ ({serverAddress}), ກະລຸນາກວດເບິ່ງອິນເຕີເນັດຂອງທ່ານ.'
	}
}

function changeLanguage (lang) {
	localStorage.language = lang;
	lang = languageDesObject[lang] || languageDesObject['vi'];
	$('[data-text-localize]').each(function () {
		var element = $(this);
		var textCode = element.attr('data-text-localize');
		element.text(lang[textCode]);
	})
}

function langText (textCode) {
	return languageDesObject[localStorage.language][textCode];
}