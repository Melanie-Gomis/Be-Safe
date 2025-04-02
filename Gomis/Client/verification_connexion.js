$(document).ready(function () {
    function mailValide(mail){
        var exp = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-zA-Z]{2,}$/;
        return exp.test(mail);
    }

    function mdpValide(mdp){
        var exp =  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[.?!@#$%^&*()_-]).+$/;
        return exp.test(mdp);
    }

    function maj_couleur(champ, validite, message){
        champ.css("color", "white");
        champ.removeClass("ok");
        if (validite) {
            champ.css("background-color", "rgb(39, 133, 45)");
            champ.next(".message").remove();
            champ.addClass("ok");
        } else {
            champ.css("background-color", "rgb(165, 30, 30)");
            champ.next(".message").length === 0 ? champ.after("<span class='message'>" + message + "</span>") : null;
        }
    }

    $("input[name='mail']").on("input", function() {
        var validite = mailValide($(this).val());
        maj_couleur($(this), validite, "L'adresse email n'est pas valide.");
    });

    $("input[name='mdp']").on("input", function() {
        var validite = mdpValide($(this).val());
        maj_couleur($(this), validite, "Le mot de passe doit contenir au moins 1 lettre, 1 chiffre et 1 caractère spécial.");
    });
    
    $("input[type='submit']").on("click", function(envoye) {
        envoye.preventDefault(); //empeche l'actualisation de la page
        var validite = true;
        $("input").each(function() {
            if(!$(this).hasClass("ok")){
                validite = false;
                return false;
            }
        })
        if(!validite){
            alert("Merci de remplir tous les champs correctement.");
        } else {
            $.ajax({
                type: "POST",
                url: "connecter.php",
                data: $("form").serialize(), //récupérer les données du formulaire
                dataType: "json",
                success: function (response) {
                    if(response.succes){
                        $("#info").html("<span class='message_succès'>" + response.message + "</span>");
                        setTimeout(() => {
                            window.location.href = "../index.php";
                        }, 1000); // temps en milisecondes
                    } else { 
                        $("#info").html("<span class='message_erreur'>" + response.message + "</span>");
                    }
                }, error: function () {
                    $("#info").html("<span class='message_erreur'> Une erreur est survenue </span>");
                }
            });
        }
    });
})