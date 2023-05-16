using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using TelnetTeamBack.Context;
using TelnetTeamBack.models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

 public class DepartementMiddleware
{
    private readonly RequestDelegate _next;

    public DepartementMiddleware(RequestDelegate next)
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
                var departement = await GetDépartementFromBodyAsync(context);
                if (context.Request.Method == HttpMethods.Post && departement != null)
                {
                    departement.UserAjout = userName;
                }
                else if (context.Request.Method == HttpMethods.Put && departement != null)
                {
                    departement.UserModif = userName;
                    dbContext.Entry(departement).Property(x => x.UserModif).IsModified = true;
                }
            }
        }

        await _next(context);
    }

    private static async Task<Département> GetDépartementFromBodyAsync(HttpContext context)
    {
        using (var reader = new StreamReader(context.Request.Body))
        {
            var body = await reader.ReadToEndAsync();
            var departement = JsonConvert.DeserializeObject<Département>(body);
            return departement;
        }
    }

}
