using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Payroll360.API.Extensions;
using Payroll360.API.Middleware;
using Payroll360.Application.Mapping;
using Payroll360.Application.Services;
using Payroll360.Core.Interfaces;
using Payroll360.Infrastructure.Data;
using Payroll360.Infrastructure.Repositories;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.Security.Claims;   // <-- required
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// ===== Add Services =====
builder.Services.AddScoped<IPayrollService, PayrollService>();
builder.Services.AddScoped<IPayrollRepository, PayrollRepository>();

builder.Services.AddScoped<ILoanService, LoanService>();
builder.Services.AddScoped<ILoanRepository, LoanRepository>();

builder.Services.AddScoped<IReimbursementService, ReimbursementService>();
builder.Services.AddScoped<IReimbursementRepository, ReimbursementRepository>();

builder.Services.AddScoped<IInsuranceService, InsuranceService>();
builder.Services.AddScoped<IInsuranceRepository, InsuranceRepository>();

builder.Services.AddScoped<INotificationService, NotificationService>();
builder.Services.AddScoped<INotificationRepository, NotificationRepository>();

builder.Services.AddScoped<IMedicalClaimService, MedicalClaimService>();
builder.Services.AddScoped<IMedicalClaimRepository, MedicalClaimRepository>();

builder.Services.AddScoped<IDashboardService, DashboardService>();
builder.Services.AddScoped<SeedDataService>();

builder.Services.AddAutoMapper(typeof(MappingProfile));

// ===== DbContext =====
builder.Services.AddDbContext<Payroll360Context>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("Default")));

// ===== Authentication & JWT =====
var jwtConfig = builder.Configuration.GetSection("Jwt");
var key = Encoding.UTF8.GetBytes(jwtConfig["Key"] ?? throw new ArgumentNullException("Jwt:Key"));

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = "Bearer";
    options.DefaultChallengeScheme = "Bearer";
})
.AddJwtBearer(options =>
{
    options.MapInboundClaims = false;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtConfig["Issuer"],
        ValidAudience = jwtConfig["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(key)
    };
});

// ===== Authorization Policies =====
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("RequireAdmin", policy => policy.RequireRole("Admin"));
    options.AddPolicy("RequireManager", policy => policy.RequireRole("Manager"));
    options.AddPolicy("RequireFinance", policy => policy.RequireRole("FinanceAdmin"));
    options.AddPolicy("RequireEmployee", policy => policy.RequireRole("Employee"));
});

// ===== CORS =====
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp", policy =>
    {
        policy.WithOrigins("http://localhost:4200", "https://localhost:4200", "http://localhost:52137", "https://localhost:52137")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// ===== Controllers =====
builder.Services.AddControllers();

// ===== Swagger with JWT Support =====
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("auth", new OpenApiInfo { Title = "Auth API", Version = "v1" });
    c.SwaggerDoc("payroll", new OpenApiInfo { Title = "Payroll API", Version = "v1" });
    c.SwaggerDoc("loans", new OpenApiInfo { Title = "Loan API", Version = "v1" });
    c.SwaggerDoc("reimbursements", new OpenApiInfo { Title = "Reimbursement API", Version = "v1" });
    c.SwaggerDoc("insurance", new OpenApiInfo { Title = "Insurance API", Version = "v1" });
    c.SwaggerDoc("medicalclaims", new OpenApiInfo { Title = "MedicalClaims API", Version = "v1" });
    c.SwaggerDoc("notifications", new OpenApiInfo { Title = "Notifications API", Version = "v1" });
    c.SwaggerDoc("dashboard", new OpenApiInfo { Title = "Dashboard API", Version = "v1" });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Enter JWT token with Bearer prefix (e.g. 'Bearer eyJhbGciOi...')",
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            Array.Empty<string>()
        }
    });

    c.DocInclusionPredicate((docName, apiDesc) =>
    {
        if (!apiDesc.TryGetMethodInfo(out var methodInfo)) return false;
        var groupName = apiDesc.ActionDescriptor.EndpointMetadata
            .OfType<Microsoft.AspNetCore.Mvc.ApiExplorerSettingsAttribute>()
            .FirstOrDefault()?.GroupName;
        return groupName == docName;
    });
});

var app = builder.Build();

// Seed database with sample data
using (var scope = app.Services.CreateScope())
{
    var seedService = scope.ServiceProvider.GetRequiredService<SeedDataService>();
    await seedService.SeedAsync();
}

// Admin user handled in-memory in AuthController

// ===== Middleware =====
app.UseExceptionMiddleware();
app.UseHttpsRedirection();
app.UseCors("AllowAngularApp");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/auth/swagger.json", "Auth API v1");
        c.SwaggerEndpoint("/swagger/payroll/swagger.json", "Payroll API v1");
        c.SwaggerEndpoint("/swagger/loans/swagger.json", "Loan API v1");
        c.SwaggerEndpoint("/swagger/reimbursements/swagger.json", "Reimbursement API v1");
        c.SwaggerEndpoint("/swagger/insurance/swagger.json", "Insurance API v1");
        c.SwaggerEndpoint("/swagger/medicalclaims/swagger.json", "MedicalClaims API v1");
        c.SwaggerEndpoint("/swagger/notifications/swagger.json", "Notifications API v1");
        c.SwaggerEndpoint("/swagger/dashboard/swagger.json", "Dashboard API v1");
        c.RoutePrefix = "swagger";
    });
}

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
