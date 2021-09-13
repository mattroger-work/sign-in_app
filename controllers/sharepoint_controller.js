const helper = require('../helpers/helper')
const Shell = require('node-powershell');

const ps = new Shell({
    executionPolicy: 'RemoteSigned',
    noProfile: true 
});

//This sends the visitors info to the sharepoint list through powershell
exports.log_visitor = function(f_name, l_name, poi, us_cit, class_visit, escort_req, rep_comp, meet_pur, location){
    var return_var;
    now = helper.get_date(true);
    console.log(now)
    ps.addCommand('Connect-PnPOnline -Url https://synaptekcorp1.sharepoint.com/QMS/ -UseWebLogin');
    ps.addCommand('Add-PnPListItem -List "Visitor Registration" -Values @{"Title" = "'+f_name+'"; "LastName" = "'+l_name+'"; "Personyouarevisitingtoday" = "'+poi+'"; "U_x002e_S_x002e_Citizen" = "'+us_cit+'"; "ClassifiedVisit" = "'+class_visit+'"; "EscortRequired" = "'+escort_req+'"; "RepresentingCompany" = "'+rep_comp+'"; "MeetingPurpose" = "'+meet_pur+'"; "TimeIn" = "'+now+'"; "Site_x0020_Location" = "'+location+'";}')
    ps.invoke()
    .then(output => {
        console.log(output);
        return_var = true;
    })
    .catch(err => {
        console.log(err);
        return_var = false;
    });
    ps.clear();
    
    return return_var 
}

//this gets all of the visitors from the sharepoint site and writes them to a file, visitors.json
exports.get_visitors = function(){
    ps.addCommand('Connect-PnPOnline -Url https://synaptekcorp1.sharepoint.com/QMS/ -UseWebLogin');
    ps.addCommand('$Today = (Get-date).ToString("yyyy-MM-dd")');
    ps.addCommand('$Tm = (Get-Date).AddDays(1)');
    ps.addCommand('$Tm = $Tm.ToString("yyyy-MM-dd")');
    ps.addCommand('$camlQuery = $("<View><Query><Where><Geq><FieldRef Name=\'TimeIn\' /><Value Type=\'Datetime\'>"+ $Today + "</Value></Geq><And><Leq><FieldRef Name=\'TimeIn\' />'+
        '<Value Type=\'Datetime\'>"+ $Tm + "</Value></Leq></And></Where></Query></View>")');
    ps.addCommand('$ListItems = Get-PnPListItem -List "Visitor Registration" -Query $camlQuery');
    ps.addCommand('$arr = @()');
    ps.addCommand('foreach($item in $ListItems){ $id = $item | Select Id; $obj = [pscustomobject]@{f_name = $item[\'Title\']; l_name = $item[\'LastName\']; id=$id.id; time_in=$item[\'TimeIn\'].AddHours(-4).toString("yyyy-MM-dd hh:mm:ss"); time_out=$item[\'TimeOut\'];}; $arr += $obj;}');
    ps.addCommand('ConvertTo-Json $arr | Out-File ./json_files/visitors.json');
    ps.invoke()
    .then(output => {
        console.log(output);
    })
    .catch(err => {
        console.log(err);
    });
    ps.clear();
}

//this is called when a vistor signs out it updates them on the sharepoint list with a Time Out field
exports.update_visitors = function(id){
    now = helper.get_date(true);
    ps.addCommand('Connect-PnPOnline -Url https://synaptekcorp1.sharepoint.com/QMS/ -UseWebLogin');
    ps.addCommand('$now = "'+now+'"');
    ps.addCommand('Set-PnPListItem -List "Visitor Registration" -Identity '+id+' -Values @{"TimeOut" = "$now";}')
    ps.invoke()
    .then(output => {
        console.log(output);
    })
    .catch(err => {
        console.log(err);
    });
    ps.clear();
}