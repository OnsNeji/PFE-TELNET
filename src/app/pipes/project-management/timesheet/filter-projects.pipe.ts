import { Pipe, PipeTransform } from '@angular/core';
import { UserProject } from 'app/models/project-management/timesheet';
import { ClosedProjectStatus } from 'app/services/project-management/timesheet';

@Pipe({ name: 'filterProjects' })

export class FilterProjectsPipe implements PipeTransform {
  transform(userProjects: UserProject[]): UserProject[] {
    return userProjects.filter(p => p.projectStatusId !== ClosedProjectStatus);
  }
}
