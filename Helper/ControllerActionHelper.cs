using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Mvc.Routing;

namespace FileUploader.Helper
{
    public static class ControllerActionHelper
    {
        public static Dictionary<string, List<string>> GetControllerActionsWithRoutes()
        {
            var controllerActions = new Dictionary<string, List<string>>();

            var assemblies = AppDomain.CurrentDomain.GetAssemblies().Where(a => !a.IsDynamic);

            foreach (var assembly in assemblies)
            {
                var controllers = assembly.GetTypes()
                    .Where(type => typeof(ControllerBase).IsAssignableFrom(type));

                foreach (var controller in controllers)
                {
                    var controllerNameAttribute = (ControllerNameAttribute)controller.GetCustomAttribute(typeof(ControllerNameAttribute));
                    string controllerName = controllerNameAttribute?.Name ?? controller.Name;

                    var actions = controller.GetMethods()
                        .Where(method => method.IsPublic && !method.IsDefined(typeof(NonActionAttribute)))
                        .Select(method => new
                        {
                            ActionName = method.Name,
                            Routes = method.GetCustomAttributes<RouteAttribute>()
                        });

                    if (actions.Any())
                    {
                        if (controllerActions.ContainsKey(controllerName))
                        {
                            controllerActions[controllerName].AddRange(actions.Select(action => $"{action.ActionName} [{string.Join(",", action.Routes.Select(route => route.Template))}]").ToList());
                        }
                        else
                        {
                            controllerActions.Add(controllerName, actions.Select(action => $"{action.ActionName} [{string.Join(",", action.Routes.Select(route => route.Template))}]").ToList());
                        }
                    }
                }
            }

            return controllerActions;

        }
    }
}
