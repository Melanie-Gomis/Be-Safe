$(document).ready(function () {
    function vide(val){
        return val.trim() !== "";
    }

    function numValide(mail){
        var exp = /^\d{5,}$/;
        return exp.test(mail);
    }

    function mailValide(mail){
        var exp = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-zA-Z]{2,}$/;
        return exp.test(mail);
    }

    function emailUnique(mail, champ){
        $.ajax({
            type: "POST",
            url: "email_unique.php",
            data: { email: mail },
            dataType: "json",
            success: function (response) {
                maj_couleur(champ, response.unique, "Cet email est déjà utilisé.");
            },
            error: function () {
                maj_couleur(champ, false, "Erreur lors de la vérification de l'email.");
            }
        });
    }

    function mdpValide(mdp){
        var exp = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[.?!@#$%^&*()_-]).+$/;
        return exp.test(mdp);
    }

    function maj_couleur(champ, validite, message){
        champ.css("color", "white");
        champ.removeClass("ok");
        champ.next(".message").remove();
        if (validite) {
            champ.css("background-color", "rgb(39, 133, 45)");
            champ.addClass("ok");
        } else {
            champ.css("background-color", "rgb(165, 30, 30)");
            champ.after("<span class='message'>" + message + "</span>");
        }
    }

    $("input[name='n']").on("input", function() {
        var validite = vide($(this).val());
        maj_couleur($(this), validite, "Le nom ne peut pas être vide.");
    });

    $("input[name='p']").on("input", function() {
        var validite = vide($(this).val());
        maj_couleur($(this), validite, "Le prénom ne peut pas être vide.");
    });

    $("input[name='adr']").on("input", function() {
        var validite = vide($(this).val());
        maj_couleur($(this), validite, "L'adresse ne peut pas être vide.");
    });

    $("input[name='num']").on("input", function() {
        var validite = numValide($(this).val());
        maj_couleur($(this), validite, "Le numéro de téléphone doit être composé que de chiffre.");
    });

    $("input[name='mail']").on("input", function() {
        var validite = mailValide($(this).val());
        if (validite){
            emailUnique($(this).val(), $(this));
        } else {
            maj_couleur($(this), validite, "L'adresse email n'est pas valide.");
        }
    });

    $("input[name='mdp1']").on("input", function() {
        var validite = mdpValide($(this).val());
        maj_couleur($(this), validite, "Le mot de passe doit contenir au moins 1 lettre, 1 chiffre et 1 caractère spécial.");
    });

    $("input[name='mdp2']").on("input", function() {
        var mdp = $("input[name='mdp1']").val();
        var validite = mdp===$(this).val();
        maj_couleur($(this), validite, "Le mot de passe n'est pas le même");
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
                url: "enregistrement.php",
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