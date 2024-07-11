// Internal Storage Management 
class Notification {

    storage_name = "";

    constructor(url, storage_name) {

        this.storage_name = storage_name;
        var notifData = new NotificationData(this.storage_name);
        var evtSource = new EventSource(url);

        evtSource.onopen = function () {
            console.log("Connection to server opened.");
        };

        evtSource.onmessage = function (e) {

            var obj = JSON.parse(e.data);
            var msg = "message : inserted" ;

            console.log(msg);

            notifData.insertData(obj);

        };

        evtSource.onerror = function () {
            console.log("EventSource failed.");
        };

        evtSource.addEventListener("ping", function (e) {
            var obj = JSON.parse(e.data);
            var msg = "ping at " + obj.time;
            console.log(msg);
        }, false);

    }

}

class NotificationData {

    storage_name = "";
    data_storage = new Array();
    data = null;

    constructor(storage_name) {
        this.storage_name = storage_name;
    }

    insertData(data){

        var created_at = moment(data["created_at"]);
        var browser_date = moment();
        var thediff = created_at.diff(browser_date, 'seconds');
       
        this.data_storage.push(data);
        this.data = data;
        this.setDataStorage();
        this.receivedClient(data['id']);
        
        if(thediff > -60){
            this.showModal();
        }

    }

    showModal(){
        var domScope = $('#modal-incomming-call');
        $(domScope).modal('show');
        $(domScope).find('.bq-call-from').text(this.data['table_number']);
        if(this.data['message'] != ""){
            $(domScope).find('.bq-calling-message').text(this.data['message']);
        }else{
            $(domScope).find('.bq-calling-message').html('<i>tidak terdapat pesan..</i>');
        }
        $(domScope).find('.bq-total-waiting-call').text(this.data['total_waiting_call']);
        
        ringtone_play();
    }

    receivedClient(notification_id){

        var dataReceivedConfirmed = {
            "user_id" : bq_G_UserId,
            "notification_id" : notification_id,
        };

        $.ajax({
            url: bq_G_ReceivedConfirmationURL,
            type: "POST",
            dataType: "JSON",
            data: {
                "data": dataReceivedConfirmed,
            },
            success: function(data) {
                // do something
            },
            error: function(data) {
                // do something
            }
        });

    }

    setDataStorage() {
        localStorage.setItem(this.storage_name, JSON.stringify(this.data_storage));
    }

    getDataStorage() {
        this.data_storage = JSON.parse(localStorage.getItem(this.storage_name));
    }


}