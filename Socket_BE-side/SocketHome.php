<?php

namespace App\Controllers\Socket;

use App\Controllers\BaseController;
use App\Models\NotificationModel;

class SocketHome extends BaseController
{
    private $notificationModel;

    function __construct()
    {

        header("Content-Type: text/event-stream");
        header("Cache-Control: no-cache");
        header("Connection: keep-alive");

        $this->notificationModel = model(NotificationModel::class);

    }

    public function admin_call_waiters()
    {
        $id = $this->request->getVar("id");
        $data = $this->notificationModel->getCallWaiters($id);

        $curDate = date(DATE_ISO8601);
        echo "event: ping\n", 'data: {"time": "' . $curDate . '"}', "\n\n";

        if (isset($data)) {
            $data['total_waiting_call'] = bq_get_calling_new();

            echo 'data: ' . json_encode($data), "\n\n";
        }

        // flush the output buffer and send echoed messages to the browser
        while (ob_get_level() > 0) {
            ob_end_flush();
        }

        flush();

        // break the loop if the client aborted the connection (closed the page)
        if (connection_aborted()) {
            return false;
        }

    }

    public function client_updates()
    {
        $id = $this->request->getVar("id");
        $data = $this->notificationModel->getOrderStatus($id);

        $curDate = date(DATE_ISO8601);
        echo "event: ping\n", 'data: {"time": "' . $curDate . '"}', "\n\n";

        if (isset($data)) {
            //$data['total_waiting_call'] = bq_get_calling_new();

            echo 'data: ' . json_encode($data), "\n\n";
        }

        // flush the output buffer and send echoed messages to the browser
        while (ob_get_level() > 0) {
            ob_end_flush();
        }

        flush();

        // break the loop if the client aborted the connection (closed the page)
        if (connection_aborted()) {
            return false;
        }

    }

}
