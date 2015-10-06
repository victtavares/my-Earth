var myEarthService = angular.module('services.offerModel', []);

myEarthService.factory('$offerModel', function($q, $localStorage) {
    var service = {};
    var iosAppID = "982015211";

    service.appStoreUrl = function() {
        var reviewURL = '';
        if (window.device && parseInt(window.device.version) >= 7) {
            reviewURL = 'itms-apps://itunes.apple.com/en/app/id' + iosAppID;
        } else {
            reviewURL = 'itms-apps://itunes.apple.com/WebObjects/MZStore.woa/wa/viewContentsUserReviews?id=' + iosAppID + '&onlyLatestVersion=true&pageNumber=0&sortOrdering=1&type=Purple+Software';
        }
        return reviewURL;
    }

    service.googlePlayUrl = function(androidAppId) {
        return 'market://details?id=' + androidAppId;
    }


    service.createOffer = function(config) {

        var specialOffer = $localStorage.getObject('specialOffer');
        if (Object.keys(specialOffer).length == 0) {
            specialOffer = {enabled: true, countOpens: 1};
        }

        var onAgree = function (offer) {
            offer.enabled = false
            if (window.device.platform === 'iOS') {
                window.open(service.appStoreUrl());
            } else if (window.device.platform === 'Android') {
                window.open(service.googlePlayUrl("androidPackageName"));
            }
            $localStorage.setObject('specialOffer',offer);
        }

        var onDecline = function(offer) {
            offer.enabled = false;
            $localStorage.setObject('specialOffer',offer);
        }

        var onRemindMeLater = function(offer) {
            offer.countOpens = 1;
            $localStorage.setObject('specialOffer',offer);
        }

        var onResume = function () {
            var specialOffer = $localStorage.getObject('specialOffer');
            console.log(JSON.stringify(specialOffer))
            if (specialOffer.countOpens >= config.showOnCount 
            && specialOffer.enabled) {
                var clickHandler = function (buttonIndex) {
                    switch (buttonIndex) {
                        case 1:
                            onAgree(specialOffer);
                            break;
                        case 2:
                            onDecline(specialOffer);
                            break;
                        case 3:
                            onRemindMeLater(specialOffer);
                            break;
                            }
                };

                var buttonLabels = [config.agreeLabel, config.declineLabel, config.remindLabel];
                navigator.notification.confirm(config.text, clickHandler, config.title, buttonLabels);

            } else if (specialOffer.enabled) {
                specialOffer.countOpens++;
            }

            $localStorage.setObject('specialOffer',specialOffer);
            
        }
        $localStorage.setObject('specialOffer',specialOffer);
        document.addEventListener('resume', onResume);

    }




    return service;
});