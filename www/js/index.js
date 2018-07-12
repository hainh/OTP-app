var serverAddress = localStorage.serverAddress || 'vic.club';
var domainRegex = /^(?!:\/\/)([a-zA-Z0-9-_]+\.)*[a-zA-Z0-9][a-zA-Z0-9-_]+\.[a-zA-Z]{2,11}?$/i;
var ipRegex = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;
var getTimeCode = '#getServerTime';
var app = {
	// Application Constructor
	initialize: function() {
		this.bindEvents();
	},
	bindEvents: function() {
		document.addEventListener('deviceready', this.onDeviceReady, false);
		document.addEventListener('resume', this.onResume, false);
	},
	onResume: function () {
		var time = parseInt(localStorage.lastCheckServerTime || 0);
		if ((new Date() - time) / 1000 / 3600 > 1) { // 1 hour
			initPhoton(serverAddress, getTimeCode).connect();
		}
	},
	onDeviceReady: function() {
		app.receivedEvent('deviceready');
		app.onResume();
	},
	receivedEvent: function(id) {
		$('.app').show();
		this.initPage();
		this.startOtp();
		$('.loader').fadeOut(100);

		animateCountdown();
		var now = new Date();
		setTimeout(function () {
			animateCountdown();
			setInterval(animateCountdown, 1000);
		}, 1000 - now.getMilliseconds());
	},
	initPage: function() {
		$('div.page').hide(); // Hide all content
		$('div.page:first').show(); // Show first page content
		$('#sendBtn').on('click', function () {
			var userOtpCode = $('#userOtpCode').val();
			if (userOtpCode) {
				var peer = initPhoton(serverAddress, userOtpCode.toUpperCase())
				peer.connect();
				$('.loader').fadeIn(100);
			} else {
				swal({
					title: 'Bạn chưa nhập mã',
					text: 'Vui lòng đăng nhập vào game, vào phần Cài đặt Bảo mật để lấy mã kích hoạt app OTP',
					button: {
						text: 'OK',
						className: 'btn btn-info',
					},
				});
			}
		});

		$('.page-control').click(function() {
			var activePage = $(this).attr('page'); 
			if ($(activePage).is(':visible')) {
				return;
			}
			
			$('div.page').hide(); // Hide all content

			$(activePage).fadeIn(100); // Fade in the active page content
			if (app.data.length) {
				$('.page-control[page="#page1"]').show();
			} else {
				$('.page-control[page="#page1"]').hide();
			}
		});

		if (this.data.length === 0) {
			$('.page-control[page="#page2"]').click();
		}

		$('.reset-icon').click(function () {
			$('#userOtpCode').focus();
		});

		$('.navbar-nav .nav-item').click(function () {
			if ($('#page2').is(':hidden')) return;

			swal('Manually Set Server Address', {
				content: 'input',
				icon: 'error',
				button: {
					text: 'OK',
					className: 'btn btn-info'
				}
			})
			.then((value) => {
				if (!value) return;
				if (!value.match(domainRegex)
					&& !value.match(ipRegex)) {
					swal({
						text: 'Invalid server address!',
						button: {
							text: 'OK',
							className: 'btn btn-info'
						},
						icon: 'warning'
					});
					return;
				}
				serverAddress = localStorage.serverAddress = value;
			});
		})
	},
	startOtp: function() {
		for (var i = 0; i < this.data.length; i++) {
			var account = this.data[i];
			this.appendOtpCard(account.username, account.key);
		}

		setTimeout((function() {
			this.updateOtp();
			setInterval(this.updateOtp.bind(this), 1000);
		}).bind(this), 1000 - (new Date).getMilliseconds());

		$('#otps .close').click(onCloseClick);
	},
	updateOtp: function() {
		var epoch = Math.round(new Date().getTime() / 1000.0);
		var countDown = 30 - (epoch % 30);
		if (epoch % 30 == 0) {
			for (var i = 0; i < this.data.length; i++) {
				var account = this.data[i];
				otp = getOtp(account.key);
				$('#otp-' + account.username).text(otp);
			}
		}
	},
	addAccount: function(username, secretKey) {
		var userExisted = this.findIndexOfAccount(username) >= 0;
		if (userExisted) {
			swal({
				title: `Tài khoản ${username} đã tồn tại`,
				button: {
					text: 'OK',
					className: 'btn btn-info',
				}
			})
			return;
		}
		this.data.push({username: username, key: secretKey});
		this.appendOtpCard(username, secretKey);
		this.saveData();
	},
	get data () {
		this._data = this._data ? this._data : (localStorage.accounts ? JSON.parse(localStorage.accounts) : []);
		return this._data;
	},
	saveData: function() {
		localStorage.accounts = JSON.stringify(this.data);
	},
	findIndexOfAccount(username) {
		return this.data.findIndex(function (element) {
			return element.username === username;
		});
	},
	appendOtpCard: function(username, key) {
		$('.otp-card-container').append(
			`<div class="otp-card" id="otp-card-${username}">
				<div class="col-md-6">
					<button type="button" class="close" delete-for="${username}" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
					<h3 class="display-4 otp" id="otp-${username}">${getOtp(key)}</h3>
					<div class="progress">
						<div class="progress-bar bg-warning" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
					</div>
					<p class="lead name">${username}</p>
				</div>
			</div>`);
	}
};

function onCloseClick() {
	var deleteFor = $(this).attr('delete-for');
	swal({
		title: 'Xóa tài khoản',
		text: 'Tài khoản này sẽ bị xóa vĩnh viễn và không thể được khôi phục. Nếu bạn thực sự muốn xóa tài khoản này vui lòng nhập lại Tên tài khoản ở đây để xác nhận:',
		content: {
			element: 'input',
			attributes: {
				placeholder: 'Tên tài khoản',
				type: 'text',
			}
		},
		buttons: [
			{
				text: 'Bỏ qua',
				visible: true,
				className: 'btn btn-raised btn-secondary',
			},
			{
				text: 'Xóa',
				visible: true,
				className: 'btn btn-raised btn-danger',
			}
		]
	}).then(function (val) {
		if (val === deleteFor) {
			app.data.splice(app.findIndexOfAccount(val), 1);
			app.saveData();
			$(`#otp-card-${val}`).remove();
			swal({
				title: 'Đã xóa tài khoản thành công.',
				icon:'success',
				button: {
					className: 'btn btn-success'
				}
			});
		}
	});
}

function animateCountdown() {
	var interval = 30;
	var now = new Date();
	var seconds = (interval - 1) - ((now.getSeconds() | 0) + interval) % interval;
	if (seconds == 29) {
		$('.progress-bar').css({transition: 'width 0.166s ease-out', width: '100%'});
		setTimeout(function () {
			$('.progress-bar').css({transition: 'width 1s linear', width: (seconds * 100 / interval) + '%'});
		}, 166);
	} else { 
		$('.progress-bar').css({width: (seconds * 100 / interval) + '%'});
	}
}

/////////////-------TOTP-------/////////////
function dec2hex(s) { return (s < 15.5 ? '0' : '') + Math.round(s).toString(16); }
function hex2dec(s) { return parseInt(s, 16); }

function leftpad(str, len, pad) {
	if (len + 1 >= str.length) {
		str = Array(len + 1 - str.length).join(pad) + str;
	}
	return str;
}

function getOtp(key) {
	var epoch = Math.round(new Date().getTime() / 1000.0);
	var time = leftpad(dec2hex(Math.floor(epoch / 30)), 16, '0');

	// updated for jsSHA v2.0.0 - http://caligatio.github.io/jsSHA/
	var shaObj = new jsSHA('SHA-1', 'HEX');
	shaObj.setHMACKey(key, 'HEX');
	shaObj.update(time);
	var hmac = shaObj.getHMAC('HEX');

	var offset = hex2dec(hmac.substring(hmac.length - 1));
	var otp = (hex2dec(hmac.substr(offset * 2, 8)) & hex2dec('7fffffff')) + '';
	otp = (otp).substr(otp.length - 6, 6);

	return otp;
}

//////////////////---------Photon---------//////////////////
var initPhoton = (function() {
	var peer;
	var userOtp;

	function initPhoton_(hostname, data) {
		if (peer && peer.isConnecting()) {
			peer.disconnect();
		}

		userOtp = data;
		peer = new Photon.PhotonPeer(['Json'], 'ws://' + hostname + ':2052');

		peer.addPeerStatusListener(Photon.PhotonPeer.StatusCodes.connect, onConnect);
		peer.addPeerStatusListener(Photon.PhotonPeer.StatusCodes.disconnect, onConnectClosed);
		peer.addPeerStatusListener(Photon.PhotonPeer.StatusCodes.connectClosed, onConnectClosed);
		peer.addPeerStatusListener(Photon.PhotonPeer.StatusCodes.error, onConnectFailed);
		peer.addPeerStatusListener(Photon.PhotonPeer.StatusCodes.timeout, onConnectFailed);

		peer.addResponseListener(PhotonCodes.OpCode.NON_AUTHENTICATE_ACTIONS, function (operationResponse) {
			console.log(operationResponse);
			if (operationResponse.vals[255] === PhotonCodes.OpCode.SETUP_OTP_APP) {
				var secretKey = operationResponse.vals[1];
				if (secretKey) {
					var playerName = operationResponse.vals[2];
					app.addAccount(playerName, secretKey);
					$(`#otp-card-${playerName} .close`).click(onCloseClick);

					swal({
						title: 'Đã Thêm tài khoản thành công.',
						icon:'success',
						button: {
							className: 'btn btn-success'
						}
					}).then(() => {
						$('.page-control[page="#page1"]').click(); // back to #page1
					});
				} else {
					swal({
						title: 'Mã không đúng',
						text: 'Vui lòng đăng nhập vào game, vào phần Cài đặt Bảo mật để lấy mã kích hoạt app OTP',
						button: {
							text: 'OK',
							className: 'btn btn-info',
						},
					});
				}
			} else if (operationResponse.vals[255] === PhotonCodes.OpCode.GET_SERVER_TIME) {
				var epochTime = operationResponse.vals[1];
				if (Math.abs(new Date().getTime() - epochTime) > 15000) {
					swal({
						title: 'Thời gian trên máy của bạn bị sai',
						text: 'Vui lòng cài đặt lại thời gian trên thiết bị của bạn nếu không chúng tôi không thể tạo ra mã OTP chính xác',
						button: {
							text: 'OK',
							className: 'btn btn-info',
						},
						icon: 'warning'
					})
				}
				localStorage.lastCheckServerTime = new Date().getTime().toString();
			}

			peer.done = true;
			peer.disconnect();
			$('.loader').fadeOut(100);
		});

		return peer;
	}

	function onConnect() {
		if (userOtp === getTimeCode) {
			peer.sendOperation(PhotonCodes.OpCode.NON_AUTHENTICATE_ACTIONS, [
				PhotonCodes.DataCode.CUSTOM_OPCODE, PhotonCodes.OpCode.GET_SERVER_TIME,
			]);
		} else {
			peer.sendOperation(PhotonCodes.OpCode.NON_AUTHENTICATE_ACTIONS, [
				PhotonCodes.DataCode.CUSTOM_OPCODE, PhotonCodes.OpCode.SETUP_OTP_APP,
				PhotonCodes.DataCode.USER_OTP, userOtp
			]);
		}
	}

	function onConnectClosed() {
	}

	function onDisconnect() {
		
	}

	function onConnectFailed() {
		if (peer.done || userOtp === getTimeCode) {
			return;
		}
		swal({
			title: 'Lỗi mạng',
			text: `Không thể kết nối tới server game (${serverAddress}), vui lòng kiểm tra lại đường truyền của bạn.`,
			icon: 'warning',
			button: {
				className: 'btn btn-info',
			}
		});
		$('.loader').fadeOut(100);
	}

	var PhotonCodes = {
		OpCode: {
			SETUP_OTP_APP: 0,
			GET_SERVER_TIME: 1,
			NON_AUTHENTICATE_ACTIONS: 249
		},

		DataCode: {
			USER_OTP: 0,
			CUSTOM_OPCODE: 255,
		}
	}

	return initPhoton_;
})();