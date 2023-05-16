using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using TelnetTeamBack.Context;
using TelnetTeamBack.models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

    public class UtilisateurMiddleware
    {

         private readonly RequestDelegate _next;

    public UtilisateurMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, AppDbContext dbContext)
    {
        if (context.Request.Method == HttpMethods.Post || context.Request.Method == HttpMethods.Put)
        {
            string userName = context.User.Identity.Name;
            if (!string.IsNullOrEmpty(userName))
            {
                var utilisateur = await GetUtilisateurFromBodyAsync(context);
                if (context.Request.Method == HttpMethods.Post && utilisateur != null)
                {
                        utilisateur.UserAjout = userName;
                }
                else if (context.Request.Method == HttpMethods.Put && utilisateur != null)
                {
                        utilisateur.UserModif = userName;
                    dbContext.Entry(utilisateur).Property(x => x.UserModif).IsModified = true;
                }
            }
        }

        await _next(context);
    }

    private static async Task<Utilisateur> GetUtilisateurFromBodyAsync(HttpContext context)
    {
        using (var reader = new StreamReader(context.Request.Body))
        {
            var body = await reader.ReadToEndAsync();
            var utilisateur = JsonConvert.DeserializeObject<Utilisateur>(body);
            return utilisateur;
        }
    }

    }
