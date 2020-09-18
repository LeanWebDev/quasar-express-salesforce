// OLD trigger

// trigger PrimaryContactTriggerWebhookTrigger on Contact (after update) {
//     if(Trigger.isUpdate) {
//         String url = 'https://echo-webhook.herokuapp.com/primary-contact-payload-test';
//         String content = Webhook.jsonContent(Trigger.new, Trigger.old);
//         Webhook.callout(url, content);
//     } else {
//         System.debug('PrimaryContactTriggerWebhookTrigger could not run because the trigger was not an update operation.');
//     }
// }
trigger onAtlasEnabledUpdateTrigger on Contact (after update) {
    if(Trigger.isUpdate) {
        // String calloutName = 'onAtlasEnabledUpdateNamedCredential';
        HttpRequest req = new HttpRequest();
        req.setEndpoint('callout:onAtlasEnabledUpdateNamedCredential');
        req.setMethod('GET');
        req.setHeader('Content-Type', 'application/json');
        String content = '{"new": ' + JSON.serialize(Trigger.new) + ', "old": ' + JSON.serialize(Trigger.old)  + '}';
        req.setBody(content);
        Http http = new Http();
        HTTPResponse res = http.send(req);
        System.debug(res.getBody());
    } else {
        System.debug('onAtlasEnabledUpdateTrigger could not run because the trigger was not an update operation.');
    }
}

// Callout class
public class atlasEnabledCallout {
    @future(callout=true)
    public static void getAtlasEnabledCallout() {
        HttpRequest req = new HttpRequest();
        req.setEndpoint('callout:onAtlasEnabledUpdateNamedCredential');
        req.setMethod('GET');
        req.setHeader('Content-Type', 'application/json');
        String content = '{"new": ' + JSON.serialize(Trigger.new) + ', "old": ' + JSON.serialize(Trigger.old)  + '}';
        req.setBody(content);
        Http http = new Http();
        HTTPResponse res = http.send(req);
        System.debug(res.getBody());
    }
}

// Trigger with callout class
trigger onAtlasEnabledUpdateTrigger on Contact (after update) {
    if(Trigger.isUpdate) {
        atlasEnabledCallout.getAtlasEnabledCallout();
    } else {
        System.debug('onAtlasEnabledUpdateTrigger could not run because the trigger was not an update operation.');
    }
}