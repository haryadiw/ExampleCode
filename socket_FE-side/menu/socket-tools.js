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
            var msg = "message : inserted";

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

    insertData(data) {

        this.data_storage = data;
        this.setDataStorage();
        this.receivedClient(data['id']);

        if(data['message'] == "UPDATE_STATUS"){
            this.updateState();
        }

        if(data['message'] == "UPDATE_ORDER_DETAIL"){
            this.updateOrderDetail(data["id_from"]);
        }

    }

    updateOrderDetail(order_id){

        $.ajax({
            url: bq_G_URL_order_detail+"?order_id="+order_id,
            type: "GET",
            dataType: "JSON",
            success: function (data) {
                bq_sync_update_order(data);
                bq_order_page_print_list();
            },
            error: function (data) {
                // do something
            }
        });

    }

    updateState() {

        var order_report = bq_get_instorage(INTERNAL_STORAGE_ORDER_REPORT);
        var order_update = bq_get_instorage(INTERNAL_STORAGE_ORDER_UPDATE);

        var tempIndex = order_report.findIndex(x => x.order_id === order_update["id_from"]);
        
        order_report[tempIndex]["status"] = order_update["status"];

        bq_upd_instorage(INTERNAL_STORAGE_ORDER_REPORT, order_report);

        bq_order_page_print_list();

    }

    receivedClient(notification_id) {

        var dataReceivedConfirmed = {
            "user_id": bq_L_table_session_id,
            "notification_id": notification_id,
        };

        $.ajax({
            url: bq_G_URL_ReceivedConfirmation,
            type: "POST",
            dataType: "JSON",
            data: {
                "data": dataReceivedConfirmed,
            },
            success: function (data) {
                // do something
            },
            error: function (data) {
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