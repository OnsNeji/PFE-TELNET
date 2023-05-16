using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TelnetTeamBack.Helpers
{
    public class EmailBody
    {
        public static string EmailStringBody(string name, string email, string emailToken)
        {
            return $@"<html>
  <head>
  </head>
  <body width=""100 %"" style=""margin: 0; padding: 0!important; mso - line - height - rule: exactly; background - color: #f5f6fa;"">
    <center style = ""width: 100%; background-color: #f5f6fa;"">
 
       <table width = ""100%"" border = ""0"" cellpadding = ""0"" cellspacing = ""0"" bgcolor = ""#f5f6fa"">
          
                  <tr>
          
                    <td style = ""padding: 40px 0;"">
           
                       <table style = ""width:100%;max-width:620px;margin:0 auto;background-color:#ffffff;"">
            
                          <tbody>
            
                            <tr>
            
                              <td style = ""text-align:center;padding: 30px 30px 15px 30px;"">
             
                                 <h2 style = ""font-size: 18px; color: #1ba3dd; font-weight: 600; margin: 0;""> Réinitialiser le mot de passe </h2>
                  
                                    </td>
                  
                                  </tr>
                  
                                  <tr>
                  
                                    <td style = ""text-align:center;padding: 0 30px 20px"">
                   
                                       <p style = ""margin-bottom: 10px;""> Bonjour {name},</p>
                         
                                             <p> Nous avons reçu une demande de réinitialisation de votre mot de passe.</p>
                            
                                                <p style = ""margin-bottom: 25px;""> Cliquez sur le lien ci-dessous pour le réinitialiser.</p>
                                 
                                                     <a href = ""http://localhost:4200/reset?email={email}&code={emailToken}"" style=""background-color:#1ba3dd;border-radius:4px;color:#ffffff;display:inline-block;font-size:13px;font-weight:600;line-height:44px;text-align:center;text-decoration:none;text-transform: uppercase; padding: 0 25px"">Réinitialiser mot de passe</a>
                  </td>
                </tr>
                <tr>
                  <td style = ""text-align:center;padding: 20px 30px 40px"">
 
                     <p> Si vous n'avez pas fait cette demande, veuillez nous contacter ou ignorer cet e-mail.</p>
    
                        <p style = ""margin: 0; font-size: 13px; line-height: 22px; color:#9ea8bb;""> Ceci est un e-mail généré automatiquement, veuillez ne pas répondre à cet e-mail. Si vous rencontrez des problèmes, veuillez nous contacter à telnetteam.intranet@gmail.com.</p>
         
                           </td>
         
                         </tr>
         
                       </tbody>
         
                     </table>
         
                     <table style = ""width:100%;max-width:620px;margin:0 auto;"">
          
                        <tbody>
          
                          <tr>
          
                            <td style = ""text-align: center; padding:25px 20px 0;"">
           
                               <p style = ""padding-top: 15px; font-size: 12px;"">Cet e-mail vous a été envoyé en tant qu'employé de <a style = ""color: #1ba3dd; text-decoration:none;"" href = """"> TELNET Team Intranet</a>, pour mettre à jour votre mot de passe.</p>
                         
                                           </td>
                         
                                         </tr>
                         
                                       </tbody>
                         
                                     </table>
                         
                                   </td>
                         
                                 </tr>
                         
                               </table>
                         
                             </center>
                         
                           </body>
                         </html>";
        }
    }
}