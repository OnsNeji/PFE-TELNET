using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using TelnetTeamBack.Context;
using TelnetTeamBack.models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

    public class SiteMiddleware
    {
    private readonly RequestDelegate _next;

    public SiteMiddleware(RequestDelegate next)
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
                var site = await GetSiteFromBodyAsync(context);
                if (context.Request.Method == HttpMethods.Post && site != null)
                {
                    site.UserAjout = userName;
                }
                else if (context.Request.Method == HttpMethods.Put && site != null)
                {
                    site.UserModif = userName;
                    dbContext.Entry(site).Property(x => x.UserModif).IsModified = true;
                }
            }
        }

        await _next(context);
    }

    private static async Task<Site> GetSiteFromBodyAsync(HttpContext context)
    {
        using (var reader = new StreamReader(context.Request.Body))
        {
            var body = await reader.ReadToEndAsync();
            var site = JsonConvert.DeserializeObject<Site>(body);
            return site;
        }
    }

}
