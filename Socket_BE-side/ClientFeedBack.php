<?php

namespace App\Controllers\Socket;

use App\Controllers\BaseController;
use App\Models\NotificationReceivedModel;

class ClientFeedBack extends BaseController
{
    private $notificationReceivedModel;

    function __construct()
    {
        $this->notificationReceivedModel =  model(NotificationReceivedModel::class);
    }

    public function set_received(){

        $data = $this->request->getPost("data");

        $user_id = $data['user_id'];
        $notification_id = $data['notification_id'];

        $this->notificationReceivedModel->setReceived($user_id, $notification_id);

    }
}