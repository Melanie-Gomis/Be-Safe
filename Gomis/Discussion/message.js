$(document).ready(function () {
    var ancien_mess = $('#messages_passes');
    var mess_rentre = $('#message_rentre');
    var boutton_envoye = $('#message_envoye');

    function charge_message() {
        $.ajax({
            type: "POST",
            url: "Discussion/message_valide.php",
            data: { action: 'charge_message' },
            dataType: "json",
            success: function (messages) {
                ancien_mess.empty();
                messages.forEach(msg => {
                    var messageElement = $('<p></p>').html(`<strong>${msg.prenom} dit </strong>'${msg.message}'`);
                    ancien_mess.append(messageElement);
                });
            },
            error: function () {
                ancien_mess.html("<span class='message_erreur'> Une erreur est survenue lors de la récupération des messages.</span>");
            }
        });
    }

    boutton_envoye.on('click', function () {
        var message = mess_rentre.val().trim();
        if (!message) return;

        $.ajax({
            type: "POST",
            url: "Discussion/message_valide.php",
            data: { action: 'envoie_mess', message: message },
            dataType: "json",
            success: function (response) {
                if (! response.succes) {
                    alert(response.mess)
                }
                mess_rentre.val('');
                charge_message();
            },
            error: function () {
                alert("Une erreur est survenue lors de l'envoi du message.");
            }
        });
    });

    setInterval(charge_message, 10000); // Rafraîchit les messages toutes les secondes
    charge_message(); // Chargement initial
});
