using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using TelnetTeamBack.Context;
using TelnetTeamBack.models;
using System;
using System.IO;
using System.Threading.Tasks;

public class PosteMiddleware
{
    private readonly RequestDelegate _next;

    public PosteMiddleware(RequestDelegate next)
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
                var poste = await GetPosteFromBodyAsync(context);
                if (context.Request.Method == HttpMethods.Post && poste != null)
                {
                    poste.DateAjout = DateTime.Now;
                    poste.UserAjout = userName;
                }
                else if (context.Request.Method == HttpMethods.Put && poste != null)
                {
                    poste.DateModif = DateTime.Now;
                    poste.UserModif = userName;
                    dbContext.Entry(poste).Property(x => x.DateAjout).IsModified = false;
                    dbContext.Entry(poste).Property(x => x.DateModif).IsModified = true;
                    dbContext.Entry(poste).Property(x => x.UserModif).IsModified = true;
                }
            }
        }

        await _next(context);
    }

    private static async Task<Poste> GetPosteFromBodyAsync(HttpContext context)
    {
        using (var reader = new StreamReader(context.Request.Body))
        {
            var body = await reader.ReadToEndAsync();
            var poste = JsonConvert.DeserializeObject<Poste>(body);
            return poste;
        }
    }
}
