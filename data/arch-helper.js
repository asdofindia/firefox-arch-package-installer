var actionlist = document.querySelector("#actionlist");
if (actionlist) {
    var installButton = document.createElement('button');
    installButton.id = "installButton";
    installButton.innerHTML = 'Install silently';
    installButton = actionlist.insertBefore(installButton, null);

    var installLog = document.createElement('div');
    installLog.id = "installLog";
    installLog = actionlist.insertBefore(installLog, null);

    installButton.addEventListener('click', function(e) {
        e.preventDefault();
        var loc_array = window.location.toString().split('/');
        self.port.emit('install', loc_array[loc_array.length - 2]);
    });

    self.port.on('data', function (data) {
        installLog.innerHTML = installLog.innerHTML + '<br>' + data;
    });
}
