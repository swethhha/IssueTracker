using AutoMapper;
using Payroll360.Core.DTOs;
using Payroll360.Core.Entities;

namespace Payroll360.Application.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Payroll
            CreateMap<Payroll360.Core.Entities.Payroll, PayrollResponseDTO>()
                .ForMember(dest => dest.EmployeeName, opt => opt.MapFrom(src => src.Employee.FullName));

            CreateMap<PayrollRequestDTO, Payroll360.Core.Entities.Payroll>();

            // Reimbursement
            CreateMap<Reimbursement, ReimbursementResponseDTO>()
                .ForMember(dest => dest.EmployeeName, opt => opt.MapFrom(src => src.Employee.FullName));

            CreateMap<ReimbursementRequestDTO, Reimbursement>();

            // MedicalClaim
            CreateMap<MedicalClaim, MedicalClaimResponseDTO>()
                .ForMember(dest => dest.EmployeeName, opt => opt.MapFrom(src => src.Employee.FullName));

            CreateMap<MedicalClaimRequestDTO, MedicalClaim>();

            // InsurancePolicy
            CreateMap<InsurancePolicy, InsurancePolicyResponseDTO>()
                .ForMember(dest => dest.EmployeeName, opt => opt.MapFrom(src => src.Employee.FullName));

            CreateMap<InsurancePolicyRequestDTO, InsurancePolicy>();
        }
    }
}
