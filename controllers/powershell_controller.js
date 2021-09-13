const fs = require('fs');
const Shell = require('node-powershell');

//init the powershell object
const ps = new Shell({
    executionPolicy: 'RemoteSigned',
    noProfile: true 
});

//gets the users from powershell and creates a users.json file and creates a new past_time.json file
exports.get_users = async function(){
    now_date = Date.now();
    raw_data = fs.readFileSync('json_files/past_time.json');
    info = JSON.parse(raw_data);
    past_date = info.time;

    //resets it every day
    full_day = 24 * 3600000
    if(now_date > past_date + full_day || !(fs.existsSync('json_files/users.json'))){
        console.log('Getting User info');
        ps.addCommand('[string]$userName = "####"');
        ps.addCommand('[string]$userPassword = "####"');
        ps.addCommand('[securestring]$secStringPassword = ConvertTo-SecureString $userPassword -AsPlainText -Force');
        ps.addCommand('[pscredential]$credObject = New-Object System.Management.Automation.PSCredential ($userName, $secStringPassword)');
        ps.addCommand('Connect-MsolService -Credential $credObject');
        ps.addCommand('Get-MsolUser -All | where {$_.isLicensed -eq $true} | Select DisplayName, UserPrincipalName | ConvertTo-Json | Out-File -FilePath .\\json_files\\users.json')
        ps.addCommand('Get-PSSession | Remove-PSSession')
        ps.invoke()
        .then(output => {
            console.log('User List created');
        })
        .catch(err => {
            console.log(err);
        });
        ps.clear();
    }
    obj = {'time': now_date};
    data = JSON.stringify(obj);
    fs.writeFile('json_files/past_time.json', data,(err)=>{});
}

//sends mail through powershell 
exports.send_mail = function(f_name, l_name,tek_email, photo_b64){
    var return_var;
    poi_split = tek_email.split('.')
    poi_first = poi_split[0]
    poi_split = poi_split[1].split('@')
    poi_last = poi_split[0]
    ps.addCommand('$emailFrom = "####"');
    ps.addCommand('$emailTo = "'+tek_email+'"');
    ps.addCommand('$subject = "'+f_name+' is visiting!"');
    ps.addCommand('$body = \'<!DOCTYPE html> <html> <body> <p> <div style="font-size: 30px; font-family: Arial, Helvetica, sans-serif; margin: 10px;"> Employee '+poi_first+', '+poi_last+': "Visitor '+f_name+', '+l_name+' has arrived at 1900 Oracle Way, Suite 800, Reston, VA offices. Your visitor is checked-in and badged awaiting your arrival in the lobby of Suite 800. Please pick up your waiting guest and escort them to the planned event" </div> </p> <img style="float: left;"src="'+photo_b64+'" width="300" height="525"> </body> </html>\'');
    ps.addCommand('$SMTPServer = "smtp.office365.com"');
    ps.addCommand('$userName = "####"');
    ps.addCommand('$passWord = ConvertTo-SecureString -String "####" -AsPlainText -Force');
    ps.addCommand('$Credential = New-Object -TypeName System.Management.Automation.PSCredential -ArgumentList $userName, $passWord');
    ps.addCommand('Send-MailMessage -To $emailTo -From $emailFrom -Subject $subject -Body $body -Credential $Credential -SmtpServer $SMTPServer -Port 587 -UseSsl -BodyAsHtml');
    ps.invoke()
    .then(output => {
        console.log(output);
        return_var = true;
    })
    .catch(err => {
        console.log(err);
        return_var = false
    });
    ps.clear();
    
    return return_var
}