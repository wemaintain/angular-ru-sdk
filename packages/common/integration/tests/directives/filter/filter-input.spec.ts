import { By } from '@angular/platform-browser';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilterModule } from '@angular-ru/common/directives';
import { FilterPredicateFn } from '@angular-ru/common/string';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

describe('[TEST]: Filter Input', () => {
    let fixture: ComponentFixture<TestComponent> | null = null;
    let component: TestComponent = null!;
    let debugElement: DebugElement | null = null;

    @Component({
        selector: 'test',
        template: `
            <div [formGroup]="form">
                <input matInput type="text" formControlName="value" [filter]="predicate" />
            </div>
        `,
        changeDetection: ChangeDetectionStrategy.OnPush
    })
    class TestComponent {
        public form = this.fb.group({ value: 'abcД' });
        public predicate: string[] | FilterPredicateFn | RegExp = ['a', 'b', 'c', ' '];

        constructor(public readonly cd: ChangeDetectorRef, private readonly fb: FormBuilder) {}
    }

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, MatInputModule, FilterModule],
            declarations: [TestComponent]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        fixture.autoDetectChanges();
        debugElement = fixture?.debugElement.query(By.css('input'));
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    function setValueAndDispatch(value: string) {
        localDetectChanges();
        debugElement = fixture!.debugElement.query(By.css('input'));
        debugElement!.nativeElement.value = value;
        debugElement!.triggerEventHandler('input', {
            target: debugElement!.nativeElement
        });
        localDetectChanges();
    }

    function localDetectChanges() {
        fixture!.componentInstance.cd.detectChanges();
    }

    it('should correct sync modelView with model', () => {
        expect(component?.form.value).toEqual({ value: 'abcД' });

        debugElement!.nativeElement.value = 'ab c Д';
        debugElement!.triggerEventHandler('input', {
            target: debugElement!.nativeElement
        });

        fixture?.whenStable().then(() => {
            fixture?.detectChanges();

            expect(component!.form.pristine).toEqual(false);
            expect(component!.form.dirty).toEqual(true);

            expect(component?.form.value).toEqual({ value: 'ab c ' });
            expect(debugElement!.nativeElement.value).toEqual('ab c ');
        });
    });

    it('should filter input with characters', () => {
        component.predicate = ['a', 'b'];
        setValueAndDispatch('aaabbbccc');
        expect(component.form.value).toEqual({ value: 'aaabbb' });
        expect(debugElement!.nativeElement.value).toEqual('aaabbb');
    });

    it('should filter input with RegExp', () => {
        component.predicate = /[a,b]+/;
        setValueAndDispatch('aaabbbccc');
        expect(component.form.value).toEqual({ value: 'aaabbb' });
        expect(debugElement!.nativeElement.value).toEqual('aaabbb');
    });

    it('should filter input with custom function', () => {
        component.predicate = (item: string): boolean => item === 'a' || item === 'b';
        setValueAndDispatch('aaabbbccc');
        expect(component.form.value).toEqual({ value: 'aaabbb' });
        expect(debugElement!.nativeElement.value).toEqual('aaabbb');
    });
});